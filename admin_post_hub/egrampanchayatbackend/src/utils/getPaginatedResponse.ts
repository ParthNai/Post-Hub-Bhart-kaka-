import { Expose } from 'class-transformer';
import {
  Callback,
  Collection,
  HydratedDocument,
  Model,
  PipelineStage,
  ProjectionFields,
} from 'mongoose';
import { PaginationQueryDto } from 'src/commondto';

class NextPrevQuery {
  _id?: { [key: string]: string };
}
interface Select {
  [_id: string]: number;
}
interface Populate {
  path: string;
  model: string;
  select?: Select;
  populate?: Populate[];
}

class RequestQuery<T, B, C> {
  model: Model<T>;
  pipeLines?: PipelineStage[];
  findQuery: B & NextPrevQuery;
  pageQuery: PaginationQueryDto;
  populate?: Populate[];
  project?: ProjectionFields<C>;
  postPaginationPipeLines?: PipelineStage.FacetPipelineStage[];
}

export const getPaginatedResponse = async <Type, QueryType, C>({
  model,
  pageQuery,
  findQuery,
  populate = [],
}: RequestQuery<Type, QueryType, C>) => {
  const pageSize = pageQuery.pageSize ? Number(pageQuery.pageSize) : 10;

  let returnData = {
    data: [] as Omit<HydratedDocument<Type, {}, {}>, never>[],
    hasNext: false,
    hasPrevious: false,
    page: pageQuery.page,
    pageSize: pageSize,
    totalCount: 0,
    next: null as NonNullable<HydratedDocument<Type, {}, {}>['_id']> | null,
    previous: null as NonNullable<HydratedDocument<Type, {}, {}>['_id']> | null,
  };

  let query = findQuery;
  if (pageQuery.fromDate || pageQuery.toDate) {
    query = {
      ...query,
      createdAt: {
        ...(pageQuery.fromDate && {
          $gte: new Date(String(pageQuery.fromDate)),
        }),
        ...(pageQuery.toDate && { $lte: new Date(String(pageQuery.toDate)) }),
      },
    };
  }
  if (pageQuery.next) {
    query = {
      ...query,
      _id: { ...query?._id, $lt: pageQuery.next },
    };
  }
  if (pageQuery.previous) {
    query = {
      ...query,
      _id: { ...query?._id, $gt: pageQuery.previous },
    };
  }
  if (pageQuery.paginate && !JSON.parse(pageQuery.paginate)) {
    // console.log('inside block');
    returnData.data = await model.find(findQuery).populate(populate);

    returnData.totalCount = returnData.data.length;
  } else if (pageQuery.page) {
    pageQuery.page = pageQuery.page - 1;
    returnData.data = await model
      .find(query)
      .sort({ createdAt: -1 })
      .skip(pageQuery.page * pageSize)
      .limit(pageSize)
      .populate(populate);

    returnData.totalCount = await model.find(query).countDocuments();
  } else if (pageQuery.next || pageQuery.previous || !pageQuery.page) {
    returnData.data = await model
      .find(query)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .populate(populate);

    let totalQuery = query;
    delete totalQuery._id?.$gt;
    delete totalQuery._id?.$lt;
    // console.log('totalQuery', totalQuery);

    returnData.totalCount = await model.find(totalQuery).countDocuments();
    const lastElementId = returnData.data[returnData.data?.length - 1]?._id;

    if (lastElementId) {
      const nextElement = await model.findOne({
        ...query,
        _id: { $lt: lastElementId },
      });

      const next = nextElement?._id;

      if (next) {
        returnData.hasNext = true;
        returnData.next = lastElementId;
      }
    }

    const previous = returnData.data[0]?._id;

    if (pageQuery.next && previous) {
      returnData.hasPrevious = true;
      returnData.previous = previous as NonNullable<
        HydratedDocument<Type, {}, {}>['_id']
      >;
    }
  }

  return returnData;
};

export const getAggregatePaginatedResponse = async <Type, QueryType, Prokect>({
  model,
  pageQuery,
  findQuery,
  pipeLines,
  populate = [],
  project,
  postPaginationPipeLines = [],
}: RequestQuery<Type, QueryType, Prokect>) => {
  const pageSize = pageQuery.pageSize ? Number(pageQuery.pageSize) : 10;
  let returnData = {
    data: [] as Omit<HydratedDocument<Type, {}, {}>, never>[],
    hasNext: false,
    hasPrevious: false,
    page: pageQuery.page,
    pageSize: pageSize,
    totalCount: 0,
    next: null as NonNullable<HydratedDocument<Type, {}, {}>['_id']> | null,
    previous: null as NonNullable<HydratedDocument<Type, {}, {}>['_id']> | null,
  };

  // Handle pagination based on paginate property and page/next/previous
  if (pageQuery.paginate && !JSON.parse(pageQuery.paginate)) {
    // console.log('pipeLines', pipeLines);
    // Standard Mongoose pagination
    returnData.data = await model.aggregate([
      { $match: findQuery },
      ...(pipeLines ? pipeLines : []),
    ]);
    returnData.totalCount = returnData.data.length;
  } else {
    // Pagination with aggregation pipeline
    let aggregationPipeline: PipelineStage[] = []; // Replace with your aggregation pipeline stages

    // Add filtering stage based on findQuery
    aggregationPipeline.push({ $match: findQuery });

    // Sorting based on createdAt (optional, adjust as needed)
    aggregationPipeline.push({ $sort: { createdAt: -1 } });

    if (pipeLines) {
      aggregationPipeline = aggregationPipeline.concat(pipeLines);
    }
    if (project) {
      aggregationPipeline = aggregationPipeline.concat([{ $project: project }]);
    }

    if (pageQuery.page) {
      aggregationPipeline = aggregationPipeline.concat([
        {
          $facet: {
            metadata: [{ $count: 'totalCount' }],
            data: [
              { $skip: (pageQuery.page - 1) * pageSize },
              { $limit: pageSize },
              ...postPaginationPipeLines,
            ],
          },
        },
      ]);
    } else if (pageQuery.next || pageQuery.previous) {
      let nextId: any, previousId: any;

      if (pageQuery.next) {
        nextId = await model
          .findOne({ _id: pageQuery.next })
          .select({ _id: 1 });
      }

      if (pageQuery.previous) {
        previousId = await model
          .findOne({ _id: pageQuery.previous })
          .select({ _id: 1 });
      }

      if (nextId) {
        aggregationPipeline.concat([
          { $match: { _id: { $lt: nextId._id } } },
          {
            $facet: {
              metadata: [{ $count: 'totalCount' }],
              data: [{ $limit: pageSize }, ...postPaginationPipeLines],
            },
          },
        ]);
      } else if (previousId) {
        aggregationPipeline.concat([
          { $match: { _id: { $gt: previousId._id } } },
          {
            $facet: {
              metadata: [{ $count: 'totalCount' }],
              data: [{ $limit: pageSize }, ...postPaginationPipeLines],
            },
          },
        ]);
      }
    }

    // Execute aggregation with pagination
    const dataFacet = await model.aggregate(aggregationPipeline);

    // console.log('[dataFacet, totalDocs]', dataFacet[0].metadata);

    returnData.data = dataFacet[0]?.data || []; // Access data from facet
    returnData.totalCount = dataFacet[0]?.metadata[0]?.totalCount || 0; // Access count from facet

    // Calculate next and previous based on last element and total count
    if (
      dataFacet.length > 0 &&
      dataFacet[0].data.length > 0 &&
      pageQuery.paginate &&
      !JSON.parse(pageQuery.paginate)
    ) {
      const lastElementId =
        dataFacet[0].data[dataFacet[0].data.length - 1]?._id;

      if (lastElementId) {
        const nextElement = await model.findOne({
          _id: { $lt: lastElementId },
        });

        const next = nextElement?._id;

        if (next) {
          returnData.hasNext = true;
          returnData.next = lastElementId;
        }
      }

      const previous = dataFacet[0].data[0]?._id;

      if (pageQuery.next && previous) {
        returnData.hasPrevious = true;
        returnData.previous = previous;
      }
    }
  }

  return returnData;
};
// else if (pageQuery.page) {
//   returnData.data = await model
//     .find(findQuery as Callback<HydratedDocument<Type, {}, {}>[]> | undefined)
//     .sort({ createdAt: -1 })
//     .skip(pageQuery.page * pageSize)
//     .limit(pageSize)
//     .populate(populate);
// }

// const  query  =findQuery as Callback<HydratedDocument<Type, {}, {}>[]> | undefined

// if (pageQuery.paginate && JSON.parse(pageQuery.paginate) {
//   const rawQuery = model
//     .find(query)
//     .sort({ _id: -1 })
//     .limit(pageSize)
//     .populate(populate)
//   let result = null;
//   // if (populates.length) {
//   //   populates.forEach((ele) => rawQuery.populate(ele));
//   // }
//   if (!pageQuery.next && !pageQuery.previous) {
//     result = await generator(pageQuery, rawQuery);
//   } else {
//     result = await rawQuery;
//   }
//   result = pageQuery.previous ? result.reverse() : result;
//   const lastElementId = result[result.length - 1]?._id;
//   const nextElement = await model.findOne({
//     _id: { $gt: result[result.length - 1]?._id },
//   });
//   const next = nextElement?._id;
//   const previous: ObjectId = pageQuery.page == 1 ? null : result[0]?._id;
//   // delete pageQuery.next;
//   // delete pageQuery.previous;
//   const totalCount = await model.find(query).count()

// if (!pageQuery.page && !JSON.parse(pageQuery.paginate as string)) {
//   returnData.data = await model
//     .find(findQuery as Callback<HydratedDocument<Type, {}, {}>[]> | undefined)
//     .populate(populate);
// }
// if (pageQuery.page) {
//   returnData.data = await model
//     .find(findQuery as Callback<HydratedDocument<Type, {}, {}>[]> | undefined)
//     .sort({ createdAt: -1 })
//     .skip(pageQuery.page * pageSize)
//     .limit(pageSize)
//     .populate(populate);
// }

//   console.log('count', returnData.data.length, pageQuery.page, pageSize);
// returnData.totalCount = totalCount
