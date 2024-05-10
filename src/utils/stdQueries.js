class StandardQueries {
  constructor(reqQuery, mongoQuery) {
    this.reqQuery = reqQuery;
    this.mongoQuery = mongoQuery;
  }

  filter() {
    if (this.reqQuery) {
      const queryObj = { ...this.reqQuery };
      const avoidables = ["fields", "sort", "page", "limit"];
      avoidables.forEach((query) => delete queryObj[query]);

      this.mongoQuery = this.mongoQuery.find(queryObj);
    }

    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      this.reqQuery.sort = this.reqQuery.sort.split(",").join(" ");
      this.mongoQuery = this.mongoQuery.sort(this.reqQuery.sort);
    }

    return this;
  }

  fields() {
    if (this.reqQuery.fields) {
      const queryFields = this.reqQuery.fields.split(",").join(" ");
      this.mongoQuery = this.mongoQuery.select(queryFields);
    }

    return this;
  }

  paginate() {
    if (this.reqQuery.page) {
      this.mongoQuery = this.mongoQuery
        .skip((this.reqQuery.page - 1) * this.reqQuery.limit)
        .limit(this.reqQuery.limit);
    } else {
      if (this.reqQuery.limit) {
        this.mongoQuery = this.mongoQuery.limit(this.reqQuery.limit);
      }
    }

    return this;
  }
}

module.exports = StandardQueries;
