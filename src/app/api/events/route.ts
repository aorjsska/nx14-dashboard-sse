// app/api/events/route.ts

import { NextRequest, NextResponse } from 'next/server'

interface VerificationData {
    passed: number
    failed: number
    total: number
  }
  
  interface RealtimeData {
    activeBugs: number
    codeCoverage: number
    activeProjects: number
    staticAnalysis: VerificationData
    unitTesting: VerificationData
    sil: VerificationData
    hil: VerificationData
    integrationTesting: VerificationData
    vehicleTesting: VerificationData
  }

let clients = new Set<ReadableStreamDefaultController>()

function generateRandomVerificationData(): VerificationData {
    const total = Math.floor(Math.random() * 100) + 50 // 50 to 149 total tests
    const passed = Math.floor(Math.random() * total)
    const failed = total - passed
    return { passed, failed, total }
}

function generateRealtimeData(): RealtimeData {
    return {
        activeBugs: Math.floor(Math.random() * 50),
        codeCoverage: Math.floor(Math.random() * 100),
        activeProjects: Math.floor(Math.random() * 10) + 1,
        staticAnalysis: generateRandomVerificationData(),
        unitTesting: generateRandomVerificationData(),
        sil: generateRandomVerificationData(),
        hil: generateRandomVerificationData(),
        integrationTesting: generateRandomVerificationData(),
        vehicleTesting: generateRandomVerificationData()
    }
}

function sendEventToAll(data: any) {
  clients.forEach(client => {
    client.enqueue(`data: ${JSON.stringify(data)}\n\n`)
  })
}

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller)

      // 초기 데이터 전송
      sendEventToAll(generateRealtimeData());

      // 5초마다 새로운 데이터 전송
      const intervalId = setInterval(() => {
        sendEventToAll(generateRealtimeData());
      }, 5000);

      // 클라이언트 연결이 종료되면 정리
      req.signal.addEventListener('abort', () => {
        clients.delete(controller)
        clearInterval(intervalId)
      })
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}

export async function POST(req: NextRequest) {
    const data = await req.json() as Partial<RealtimeData>;
    const currentData = generateRealtimeData(); // 현재 데이터 생성
    const updatedData = { ...currentData, ...data }; // 새 데이터로 업데이트
    sendEventToAll(updatedData);
    return NextResponse.json({ message: 'Data sent to all clients' }, { status: 200 });
  }