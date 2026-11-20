import { NextResponse } from "next/server";
import {
  getJobTraceDataset,
  retryJobExecution,
  cancelJobExecution,
  resetJobTraceData,
} from "@/lib/ai-job-trace-storage";
import { generateExecutionTraceCsv } from "@/lib/ai-job-trace";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId") || "JOB-7845";
    const format = searchParams.get("format");

    const dataset = getJobTraceDataset(jobId);

    if (format === "csv") {
      const csv = generateExecutionTraceCsv(dataset.executionTrace, dataset.overview.jobId);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="execution-trace-${jobId}.csv"`,
        },
      });
    }

    return NextResponse.json({ success: true, dataset, ...dataset });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, jobId = "JOB-7845" } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing required 'action' parameter." }, { status: 400 });
    }

    switch (action) {
      case "retry": {
        const { adminName } = body;
        const result = retryJobExecution(jobId, adminName || "parth");
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json({ success: true, dataset: result.dataset });
      }

      case "cancel": {
        const { reason, adminName } = body;
        const result = cancelJobExecution(jobId, reason || "Cancelled by Admin", adminName || "parth");
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json({ success: true, dataset: result.dataset });
      }

      case "reset": {
        const resetDataset = resetJobTraceData();
        return NextResponse.json({ success: true, dataset: resetDataset });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
