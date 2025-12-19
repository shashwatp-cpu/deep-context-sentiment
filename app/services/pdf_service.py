import os
import math
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
    def draw_pie_chart(pdf, x, y, radius, summary: dict):
        """Draws a vector pie chart directly on the PDF using FPDF primitives."""
        # Data Prep
        data = []
        total = 0
        
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
                short_label = key.split('_')[0].title()
                hex_c = color_map.get(key, "#cccccc")
                data.append({"label": short_label, "value": value, "color": hex_c})
                total += value
        
        if total == 0:
            return

        # Draw Chart
        start_angle = 90
        
        # We use a local context for transparency (Glass effect)
        with pdf.local_context(fill_opacity=0.85):
            pdf.set_draw_color(255, 255, 255) # White borders
            pdf.set_line_width(1.5) # Thick border
            
            for item in data:
                res_angle = (item['value'] / total) * 360
                end_angle = start_angle + res_angle
                
                # Check FPDF sector direction. 
                # Usually standard mathematical (counter-clockwise) or clockwise?
                # FPDF2 sector: angles in degrees. 0 is right, 90 is top?
                # We'll assume standard.
                
                rgb = PDFService._hex_to_rgb(item['color'])
                pdf.set_fill_color(*rgb)
                
                # Draw Sector
                # Note: fpdf2 uses standard degrees? 
                # Let's use negative for clockwise if needed, but positive is usually fine.
                # Important: sector(x, y, r, a_start, a_end)
                pdf.sector(x, y, radius, start_angle, end_angle, style='FD')
                
                # Draw Percentage Label
                # Mid angle for label
                mid_angle = math.radians(start_angle + (res_angle / 2))
                # Position (r * 0.7 to be inside)
                # PDF coord system: Y increases downwards? FPDF usually top-left origin.
                # So y + sin might need checking. 
                # Actually FPDF sector usually handles the coord flip.
                # Let's try standard trigonometry, flipping Y if needed.
                # FPDF: 0 deg = Right (3 o'clock). Positive = Counter-Clockwise.
                # We started at 90 (Top).
                
                # For text, we calculate manually.
                # If Y is Down, then Top is -90? Or 270?
                # Let's stick to simple logic: 
                # label_x = x + r*0.6 * cos(-mid_angle) # FPDF y coords are inverted relative to math?
                # Let's rely on the Legend for clarity for now to avoid math errors in blind edit.
                # Actually, adding % is nice.
                # Try simple geometric position.
                
                pct = (item['value'] / total) * 100
                if pct > 4: # Only label if > 4%
                     # Conversion for display
                     # FPDF2 angles: 0 is right. increasing is CCW.
                     # But visual Y is down.
                     # Let's output text.
                     pdf.set_text_color(255, 255, 255)
                     pdf.set_font("Helvetica", "B", 10)
                     
                     # Simple approximation: just skip text on chart, put in legend.
                     # Text placement blindly often overlaps.
                
                start_angle += res_angle

        # Draw Legend Below
        legend_y = y + radius + 10
        legend_x = x - 60 # Start leftish
        
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(50, 50, 50)
        
        row_count = 0
        for i, item in enumerate(data):
            rgb = PDFService._hex_to_rgb(item['color'])
            
            # Position (2 columns?)
            col = i % 2
            row = i // 2
            
            lx = legend_x + (col * 70)
            ly = legend_y + (row * 6)
            
            # Color Box
            with pdf.local_context(fill_opacity=0.85):
                pdf.set_fill_color(*rgb)
                pdf.rect(lx, ly, 4, 4, 'F')
            
            # Text
            pct = (item['value'] / total) * 100
            pdf.set_xy(lx + 6, ly)
            pdf.cell(60, 4, f"{item['label']} ({pct:.1f}%)")
            
            row_count = row

        return (row_count + 1) * 6 + 10 # Return height of legend

    @staticmethod
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
        
        # Chart (Vector Based)
        # Center X is 105 (A4 width 210)
        # Y is current + radius + margin
        try:
            current_y = pdf.get_y()
            center_x = 105
            center_y = current_y + 45 # Radius 35 + space
            radius = 35 
            
            # This draws chart AND legend
            legend_height = PDFService.draw_pie_chart(pdf, center_x, center_y, radius, data.summary.dict())
            
            # Advance Cursor (Chart Radius + Legend Height + Margin)
            # Center Y + Radius = Bottom of Pie. 
            # Legend starts at Y + Radius + 10.
            # Legend height returned is the height of legend block.
            pdf.set_y(center_y + radius + 10 + legend_height + 5)
            
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
                total_height = 12 # Header
                comment_lines = []
                
                pdf.set_font(main_font, "", 10)
                for c in comments[:3]:
                    clean_c = c.replace('\n', ' ').strip()
                    clean_c = f"- {clean(clean_c)}"
                    lines = pdf.multi_cell(180, 6, clean_c, split_only=True)
                    comment_lines.append(lines)
                    total_height += len(lines) * 6
                
                total_height += 5 # Bottom padding

                # 2. Check Page Break
                if pdf.get_y() + total_height > 275:
                    pdf.add_page()
                else:
                    pdf.ln(5) 

                # 3. Get Color & Background
                map_key = category.lower().replace(" ", "_").replace("/", "_")
                hex_color = color_map.get(map_key, "#cccccc")
                rgb = PDFService._hex_to_rgb(hex_color)
                light_rgb = PDFService._lighten_color(*rgb, factor=0.80) 

                start_x = 10
                start_y_card = pdf.get_y()

                # Draw Card Background
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
                
                current_text_y = pdf.get_y() + 1
                for i, lines in enumerate(comment_lines):
                     for line in lines:
                         pdf.set_xy(start_x + 5, current_text_y)
                         pdf.cell(180, 6, line, new_x="LMARGIN", new_y="NEXT")
                         current_text_y += 6
                
                # Move cursor
                pdf.set_y(start_y_card + total_height)

        return bytes(pdf.output())
