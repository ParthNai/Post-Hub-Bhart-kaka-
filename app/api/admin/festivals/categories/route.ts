/**
 * REST API Route for Screen 37: Festival & Event Categories Management
 * GET  - Retrieve categories, summary, display settings, and filtered lists
 * POST - Create, update, delete, duplicate, reorder, toggleStatus, updateDisplaySettings, reset
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getFestivalCategoriesDataset,
  createFestivalCategory,
  updateFestivalCategory,
  deleteFestivalCategory,
  duplicateFestivalCategory,
  reorderCategories,
  toggleCategoryStatus,
  updateCategoryDisplaySettings,
  getCategoryEvents,
  resetFestivalCategoriesData,
} from "@/lib/festival-categories-storage";
import { type FestivalCategory } from "@/lib/festival-categories";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim();
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") || "priority";
    const direction = searchParams.get("direction") || "asc";
    const categoryId = searchParams.get("categoryId");

    const dataset = await getFestivalCategoriesDataset();
    let categories = [...dataset.categories];

    // Filter by search
    if (search) {
      categories = categories.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.description.toLowerCase().includes(search) ||
          c.slug.toLowerCase().includes(search)
      );
    }

    // Filter by type
    if (type && type !== "All" && type !== "All Types") {
      categories = categories.filter((c) => c.type.toLowerCase() === type.toLowerCase());
    }

    // Filter by status
    if (status && status !== "All" && status !== "All Status") {
      categories = categories.filter((c) => c.status.toLowerCase() === status.toLowerCase());
    }

    // Sorting
    categories.sort((a: FestivalCategory, b: FestivalCategory) => {
      let comparison = 0;
      if (sort === "priority") {
        comparison = a.displayPriority - b.displayPriority;
      } else if (sort === "alphabetical" || sort === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sort === "events" || sort === "eventCount") {
        comparison = b.eventCount - a.eventCount;
      } else if (sort === "updated" || sort === "recentlyUpdated") {
        comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else {
        comparison = a.displayPriority - b.displayPriority;
      }
      return direction === "desc" ? -comparison : comparison;
    });

    // Associated events for selected or default category
    const targetCatId = categoryId || (categories.length > 0 ? categories[0].id : "CAT-FEST-001");
    const associatedEvents = await getCategoryEvents(targetCatId);

    return NextResponse.json({
      success: true,
      summary: dataset.summary,
      displaySettings: dataset.displaySettings,
      categories,
      allCategories: dataset.categories,
      associatedEvents: associatedEvents.slice(0, 10),
      auditHistory: dataset.auditHistory.slice(0, 15),
      lastUpdated: dataset.lastUpdated,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to load categories dataset";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Action parameter is required." },
        { status: 400 }
      );
    }

    switch (action) {
      case "create": {
        const newCategory = await createFestivalCategory(body.category || body);
        return NextResponse.json({
          success: true,
          message: `Category '${newCategory.name}' created successfully.`,
          category: newCategory,
        });
      }

      case "update": {
        if (!body.id) {
          return NextResponse.json(
            { success: false, error: "Category ID is required for update." },
            { status: 400 }
          );
        }
        const updated = await updateFestivalCategory(body.id, body.category || body);
        return NextResponse.json({
          success: true,
          message: `Category '${updated.name}' updated successfully.`,
          category: updated,
        });
      }

      case "delete": {
        if (!body.id) {
          return NextResponse.json(
            { success: false, error: "Category ID is required for deletion." },
            { status: 400 }
          );
        }
        const result = await deleteFestivalCategory(body.id, body.reassignToId);
        return NextResponse.json({
          success: true,
          message: result.message,
        });
      }

      case "duplicate": {
        if (!body.id) {
          return NextResponse.json(
            { success: false, error: "Category ID is required for duplication." },
            { status: 400 }
          );
        }
        const duplicated = await duplicateFestivalCategory(body.id);
        return NextResponse.json({
          success: true,
          message: `Category duplicated successfully as '${duplicated.name}'.`,
          category: duplicated,
        });
      }

      case "reorder": {
        if (!Array.isArray(body.orderedIds)) {
          return NextResponse.json(
            { success: false, error: "orderedIds array is required for reordering." },
            { status: 400 }
          );
        }
        const reordered = await reorderCategories(body.orderedIds);
        return NextResponse.json({
          success: true,
          message: "Categories reordered successfully.",
          categories: reordered,
        });
      }

      case "toggleStatus": {
        if (!body.id) {
          return NextResponse.json(
            { success: false, error: "Category ID is required to toggle status." },
            { status: 400 }
          );
        }
        const toggled = await toggleCategoryStatus(body.id);
        return NextResponse.json({
          success: true,
          message: `Category status updated to '${toggled.status}'.`,
          category: toggled,
        });
      }

      case "updateDisplaySettings": {
        const updatedSettings = await updateCategoryDisplaySettings(body.settings || {});
        return NextResponse.json({
          success: true,
          message: "Display settings updated successfully.",
          displaySettings: updatedSettings,
        });
      }

      case "getEvents": {
        const events = await getCategoryEvents(body.categoryId || body.categoryName || "");
        return NextResponse.json({
          success: true,
          events,
        });
      }

      case "reset": {
        const resetDataset = await resetFestivalCategoriesData();
        return NextResponse.json({
          success: true,
          message: "Festival categories reset to canonical seed.",
          dataset: resetDataset,
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unsupported action: '${action}'.` },
          { status: 400 }
        );
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to process category action";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
  }
}
