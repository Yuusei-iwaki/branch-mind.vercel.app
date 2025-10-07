import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { description } = body;

    if (!description) {
        return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4.1-nano",
            messages: [
                {
                    role: "system",
                    content: `あなたはGitコミットメッセージ生成AIです。以下のルールに従って生成してください。
                        - 日本語
                        - 20文字以内
                        - 出力はコミットメッセージのみ`,
                },
                {
                    role: "user",
                    content: `作業内容: ${description}`,
                },
            ],
            max_tokens: 40,
        });

        const commitMessage = response.choices[0].message.content?.trim() || `commit message`;
        return NextResponse.json({ commitMessage });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to generate commit message" }, { status: 500 });
    }
}