import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Payment request received:", body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}