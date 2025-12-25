import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";


export async function POST(req: NextRequest) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "Missing RESEND_API_KEY environment variable" },
            { status: 500 }
        );
    }

    const resend = new Resend(apiKey);

    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const data = await resend.emails.send({
            from: "onboarding@resend.dev", // Using default testing domain
            to: ["shashwat.p@nexgrowdigital.com"], //connect@eliminatecontext.com
            subject: `New Contact Form Submission from ${name}`,
            text: `
        Name: ${name}
        Email: ${email}
        Message:
        ${message}
      `,
            replyTo: email,
        });

        if (data.error) {
            console.error("Resend Error:", data.error);
            return NextResponse.json({ error: data.error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error("Internal Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
