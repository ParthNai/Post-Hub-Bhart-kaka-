import { NextResponse } from "next/server";
import {
  getWorkerDataset,
  pauseWorker,
  resumeWorker,
  drainWorker,
  restartWorker,
  updateWorkerConfiguration,
  updateWorkerPool,
  queryWorkers,
  resetWorkerData,
} from "@/lib/ai-workers-storage";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const pool = searchParams.get("pool") || undefined;
    const status = searchParams.get("status") || undefined;

    const dataset = getWorkerDataset();
    const queryResult = queryWorkers({ search, pool, status });

    return NextResponse.json({
      summary: dataset.summary,
      pools: dataset.pools,
      workers: queryResult.workers,
      total: queryResult.total,
      activityHistory: dataset.activityHistory,
      configuration: dataset.configuration,
      lastUpdated: dataset.lastUpdated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing required 'action' parameter." }, { status: 400 });
    }

    switch (action) {
      case "pause": {
        const { workerId, adminName } = body;
        if (!workerId) {
          return NextResponse.json({ error: "Missing required 'workerId'." }, { status: 400 });
        }
        const result = pauseWorker(workerId, adminName || "parth");
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        const dataset = getWorkerDataset();
        return NextResponse.json({ success: true, worker: result.worker, dataset });
      }

      case "resume": {
        const { workerId, adminName } = body;
        if (!workerId) {
          return NextResponse.json({ error: "Missing required 'workerId'." }, { status: 400 });
        }
        const result = resumeWorker(workerId, adminName || "parth");
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        const dataset = getWorkerDataset();
        return NextResponse.json({ success: true, worker: result.worker, dataset });
      }

      case "drain": {
        const { workerId, reason, adminName } = body;
        if (!workerId) {
          return NextResponse.json({ error: "Missing required 'workerId'." }, { status: 400 });
        }
        const result = drainWorker(workerId, reason || "Due to maintenance", adminName || "parth");
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        const dataset = getWorkerDataset();
        return NextResponse.json({ success: true, worker: result.worker, dataset });
      }

      case "restart": {
        const { workerId, adminName } = body;
        if (!workerId) {
          return NextResponse.json({ error: "Missing required 'workerId'." }, { status: 400 });
        }
        const result = restartWorker(workerId, adminName || "parth");
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        const dataset = getWorkerDataset();
        return NextResponse.json({ success: true, worker: result.worker, dataset });
      }

      case "update-config": {
        const { configuration } = body;
        if (!configuration) {
          return NextResponse.json({ error: "Missing 'configuration' payload." }, { status: 400 });
        }
        const result = updateWorkerConfiguration(configuration);
        const dataset = getWorkerDataset();
        return NextResponse.json({ success: true, configuration: result.configuration, dataset });
      }

      case "update-pool": {
        const { poolId, pool } = body;
        if (!poolId || !pool) {
          return NextResponse.json({ error: "Missing 'poolId' or 'pool' payload." }, { status: 400 });
        }
        const result = updateWorkerPool(poolId, pool);
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        const dataset = getWorkerDataset();
        return NextResponse.json({ success: true, pool: result.pool, dataset });
      }

      case "reset": {
        const resetDataset = resetWorkerData();
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
