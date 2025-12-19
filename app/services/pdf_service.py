import io
import os
import matplotlib.pyplot as plt
from fpdf import FPDF
from app.models.schemas import AnalysisResponse

class ReportPDF(FPDF):
    def header(self):
        # Brand Colors
        # Voltage Yellow: #CCFF00 -> (204, 255, 0)
        # Navy: #000033 -> (0, 0, 51)
        
        # Yellow Top Bar
        self.set_fill_color(204, 255, 0)
        self.rect(0, 0, 210, 20, 'F')
        
        # Logo / Brand Name
        self.set_font("Helvetica", "B", 16)
        self.set_text_color(0, 0, 51)
        self.set_xy(10, 5)
        self.cell(0, 10, "EliminateContext", new_x="LMARGIN", new_y="NEXT", align='L')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f"Analysis Report - Page {self.page_no()}/{{nb}}", align='C')

class PDFService:
    @staticmethod
    def _hex_to_rgb(hex_color: str):
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
        
    @staticmethod
    def _lighten_color(r, g, b, factor=0.85):
        """Mix color with white to simulate transparency/pastel."""
        return (
            int(r + (255 - r) * factor),
            int(g + (255 - g) * factor),
            int(b + (255 - b) * factor)
        )

    @staticmethod
    def create_chart(summary: dict) -> io.BytesIO:
        """Generate a pie chart for sentiment summary."""
        labels = []
        sizes = []
        colors = []
        
        # Color mapping matching frontend
        color_map = {
            "supportive_empathetic": "#84cc16",
            "appreciative_praising": "#22c55e",
            "informative_neutral": "#94a3b8",
            "sarcastic_ironic": "#a855f7",
            "critical_disapproving": "#f59e0b",
            "angry_hostile": "#ef4444"
        }

        for key, value in summary.items():
            if key != "totalComments" and value > 0:
                short_label = key.split('_')[0].title() # Shorten label if needed
                labels.append(short_label)
                sizes.append(value)
                colors.append(color_map.get(key, "#cccccc"))

        if not sizes:
            return None

        # Create plot with "Glass" effect
        plt.figure(figsize=(8, 8))
        
        # Wedgeprops with alpha<1 and white edge gives glass segment look
        wedges, texts, autotexts = plt.pie(
            sizes, 
            labels=labels, 
            colors=colors, 
            autopct='%1.1f%%', 
            startangle=90,
            pctdistance=0.85,
            wedgeprops={'linewidth': 3, 'edgecolor': 'white', 'alpha': 0.85},
            textprops={'fontsize': 14, 'weight': 'bold', 'color': '#555555'}
        )
        
        # Style percentage text to be white/clearer inside the segments? 
        # Actually with alpha 0.85, white text might be hard to read on light colors. 
        # Let's keep dark text outside or default.
        # Actually, let's make the chart a Donut for extra style? 
        # User said "size of pie graph". I'll keep it full pie but larger.
        
        plt.setp(autotexts, size=12, weight="bold", color="white")
        plt.axis('equal')
        
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight', transparent=True)
        plt.close()
        buf.seek(0)
        return buf

    @staticmethod
    def safe_text(text: str) -> str:
        """Sanitize text to be compatible with Latin-1 (standard PDF font)."""
    def sanitize_text(text: str) -> str:
        """
        Sanitize text to prevent font errors.
        - Removes characters outside the Basic Multilingual Plane (BMP) i.e. ord(c) > 0xFFFF.
        - This effectively strips standard Emojis (which Arial Unicode doesn't support)
        - But PRESERVES most languages (Chinese, Arabic, accented chars, etc.)
        """
        if not text:
            return ""
        # Filter out characters that standard TTF fonts on macOS (like Arial Unicode) often miss (Emojis)
        return "".join(c for c in text if ord(c) <= 0xFFFF)

    @staticmethod
    def generate_pdf(data: AnalysisResponse) -> bytes:
        """Generate PDF report from analysis data."""
        pdf = ReportPDF()
        pdf.alias_nb_pages()
        pdf.add_page()
        pdf.set_auto_page_break(auto=True, margin=15)
        
        # Font Loading Logic
        # 1. Look for User-Provided "DejaVuSans.ttf" (Best for Emoji/Unicode)
        base_dir = os.path.dirname(os.path.dirname(__file__)) # app/
        font_dir = os.path.join(base_dir, "static/fonts")
        dejavu_path = os.path.join(font_dir, "DejaVuSans.ttf")
        
        main_font = "Helvetica" # Default fallback
        unicode_available = False

        try:
            if os.path.exists(dejavu_path):
                pdf.add_font("DejaVu", fname=dejavu_path)
                main_font = "DejaVu"
                unicode_available = True # We trust this font has emojis
            else:
                # 2. Fallback to System Fonts (Good for Chinese/Accents, but NO Emojis usually)
                system_font_candidates = [
                    "/Library/Fonts/Arial Unicode.ttf",
                    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
                    "/System/Library/Fonts/Supplemental/Arial.ttf"
                ]
                for font_path in system_font_candidates:
                    if os.path.exists(font_path):
                        pdf.add_font("ArialUnicode", fname=font_path)
                        main_font = "ArialUnicode"
                        # unicode_available = False # Arial Unicode lacks emojis, so we keep this False to trigger sanitization
                        break
        except Exception as e:
            print(f"Font loading error: {e}")
            main_font = "Helvetica"
            unicode_available = False

        # Helper to conditionally sanitize
        def clean(txt):
            if not txt: return ""
            # If we have the good user font, use text as is.
            # Otherwise (System font or Helvetica), strip high-plane emojis to prevent warnings/artifacts.
            return txt if unicode_available else PDFService.sanitize_text(txt)

        # 1. Report Title
        pdf.ln(5)
        pdf.set_font(main_font, "", 24) 
        pdf.set_text_color(0, 0, 51)
        pdf.cell(0, 10, 'Analysis Report', new_x="LMARGIN", new_y="NEXT", align='L')
        
        pdf.set_font(main_font, "", 10)
        pdf.set_text_color(100, 100, 100)
        pdf.cell(0, 8, f"Generated on {data.timestamp.strftime('%Y-%m-%d %H:%M')}", new_x="LMARGIN", new_y="NEXT", align='L')
        pdf.ln(5)

        # 2. Context Section
        pdf.set_fill_color(248, 248, 250)
        start_y = pdf.get_y()
        pdf.rect(10, start_y, 190, 40, 'F')
        pdf.set_xy(15, start_y + 5)
        
        pdf.set_font(main_font, "", 14)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(0, 8, 'Context Source', new_x="LMARGIN", new_y="NEXT")
        
        pdf.set_font(main_font, "", 10)
        pdf.set_x(15)
        pdf.multi_cell(180, 6, f"Platform: {clean(data.platform.value.upper())}", new_x="LMARGIN", new_y="NEXT")
        pdf.set_x(15)
        pdf.multi_cell(180, 6, f"URL: {clean(data.postUrl)}", new_x="LMARGIN", new_y="NEXT")
        
        if data.postContext.title:
            pdf.set_x(15)
            pdf.multi_cell(180, 6, f"Title: {clean(data.postContext.title)}", new_x="LMARGIN", new_y="NEXT")
        
        pdf.set_y(start_y + 45)

        # 3. Sentiment Summary (Chart + Stats)
        pdf.set_font(main_font, "", 14)
        pdf.cell(0, 10, 'Sentiment Overview', new_x="LMARGIN", new_y="NEXT")
        
        # Stats
        pdf.set_font(main_font, "", 11)
        pdf.cell(0, 8, f"Total Comments analyzed: {data.summary.totalComments}", new_x="LMARGIN", new_y="NEXT")
        
        # Chart
        try:
            chart_buf = PDFService.create_chart(data.summary.dict())
            if chart_buf:
                # Larger, Centered Image
                pdf.image(chart_buf, w=120, x=45) 
                pdf.set_y(pdf.get_y() + 125) 
        except Exception as e:
            pdf.set_font(main_font, "", 10)
            pdf.cell(0, 10, f"(Chart generation failed: {clean(str(e))})", new_x="LMARGIN", new_y="NEXT")

        # 4. Top Comments
        if pdf.get_y() > 200:
             pdf.add_page()
             
        pdf.ln(5)
        pdf.set_font(main_font, "", 14)
        pdf.set_text_color(0, 0, 51)
        pdf.cell(0, 10, 'Key Insights (Top Comments)', new_x="LMARGIN", new_y="NEXT")
        
        # Color mapping (same as above)
        color_map = {
            "supportive_empathetic": "#84cc16",
            "appreciative_praising": "#22c55e",
            "informative_neutral": "#94a3b8",
            "sarcastic_ironic": "#a855f7",
            "critical_disapproving": "#f59e0b",
            "angry_hostile": "#ef4444"
        }

        for category, comments in data.topComments.items():
            if comments:
                # 1. Calculate Dynamic Height
                # Header space: 10
                # Padding bottom: 5
                # Space between comments: 0?
                total_height = 12 # Header + top padding
                comment_lines = [] # Store lines to avoid re-splitting
                
                pdf.set_font(main_font, "", 10) # Set font for calculation
                for c in comments[:3]:
                    clean_c = c.replace('\n', ' ').strip()
                    clean_c = f"- {clean(clean_c)}"
                    # Calculate lines this comment will take
                    # split_only=True returns a list of strings
                    lines = pdf.multi_cell(180, 6, clean_c, split_only=True)
                    comment_lines.append(lines)
                    total_height += len(lines) * 6
                
                total_height += 5 # Bottom padding

                # 2. Check Page Break
                if pdf.get_y() + total_height > 275:
                    pdf.add_page()
                else:
                    pdf.ln(5) # Space between cards

                # 3. Get Color & Background
                map_key = category.lower().replace(" ", "_").replace("/", "_")
                hex_color = color_map.get(map_key, "#cccccc")
                rgb = PDFService._hex_to_rgb(hex_color)
                # Factor 0.85 -> 0.80 for more visibility
                light_rgb = PDFService._lighten_color(*rgb, factor=0.80) 

                start_x = 10
                start_y_card = pdf.get_y()

                # Draw Card Background
                # Rounding corners if possible, otherwise rect
                pdf.set_fill_color(*light_rgb)
                pdf.rect(start_x, start_y_card, 190, total_height, 'F')
                
                # 4. Render Content
                # Header
                pdf.set_xy(start_x + 5, start_y_card + 4)
                pdf.set_font(main_font, "", 11)
                pdf.set_text_color(0, 0, 0)
                pdf.cell(0, 6, f"{clean(category)}:", new_x="LMARGIN", new_y="NEXT")
                
                # Comments
                pdf.set_font(main_font, "", 10)
                pdf.set_text_color(50, 50, 50)
                
                # We already split lines, we can print them line by line or use multi_cell again
                # Using multi_cell is safer to ensure alignment
                current_text_y = pdf.get_y() + 1
                for i, lines in enumerate(comment_lines):
                     # lines is list of strings
                     for line in lines:
                         pdf.set_xy(start_x + 5, current_text_y)
                         pdf.cell(180, 6, line, new_x="LMARGIN", new_y="NEXT")
                         current_text_y += 6
                
                # Move cursor past the card
                pdf.set_y(start_y_card + total_height)

        return bytes(pdf.output())
