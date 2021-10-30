const defaultCurrentPage = 1;
const defaultTotalItemCount = 0;
const defaultPagePerItemCount = 20;

const maxShownPageCount = 10;

function getTotalPage(totalItemCount, pagePerItemCount) {
  let totalPage;
  if (totalItemCount % pagePerItemCount === 0) {
    totalPage = totalItemCount / pagePerItemCount;
  } else {
    totalPage = Math.floor(totalItemCount / pagePerItemCount) + 1;
  }
  return totalPage;
}

export default function Pagination({
  currentPage,
  totalItemCount,
  pagePerItemCount,
}) {
  this.currentPage =
    currentPage === undefined ? defaultCurrentPage : currentPage;
  this.totalItemCount =
    totalItemCount === undefined ? defaultTotalItemCount : totalItemCount;
  this.pagePerItemCount =
    pagePerItemCount === undefined ? defaultPagePerItemCount : pagePerItemCount;

  this.setState = ({ currentPage, totalItemCount, pagePerItemCount }) => {
    if (currentPage !== undefined) this.currentPage = currentPage;
    if (totalItemCount !== undefined) this.totalItemCount = totalItemCount;
    if (pagePerItemCount !== undefined)
      this.pagePerItemCount = pagePerItemCount;

    if (isNaN(this.currentPage)) this.currentPage = defaultCurrentPage;
    if (isNaN(this.totalItemCount)) this.totalItemCount = defaultTotalItemCount;
    if (isNaN(this.pagePerItemCount))
      this.pagePerItemCount = defaultPagePerItemCount;

    if (this.currentPage <= 0) this.currentPage = defaultCurrentPage;
    if (this.totalItemCount < 0) this.totalItemCount = defaultTotalItemCount;
    if (this.pagePerItemCount <= 0)
      this.pagePerItemCount = defaultPagePerItemCount;

    let totalPage = getTotalPage(this.totalItemCount, this.pagePerItemCount);
    if (totalPage < this.currentPage) {
      this.currentPage = totalPage;
    }
  };

  // initialize
  this.setState({
    currentPage: this.currentPage,
    totalItemCount: this.totalItemCount,
    pagePerItemCount: this.pagePerItemCount,
  });

  this.render = () => {
    let totalPage = getTotalPage(this.totalItemCount, this.pagePerItemCount);
    let isLastPage = totalPage === 0 || this.currentPage === totalPage;

    let result = "<div>";
    if (this.currentPage > 1) {
      result += `<span class="prev-page"></span>`;
    }

    let startIndex;
    if (this.currentPage % maxShownPageCount === 0) {
      startIndex = this.currentPage / maxShownPageCount;
    } else {
      startIndex = Math.ceil(this.currentPage / maxShownPageCount);
    }

    let start = (startIndex - 1) * maxShownPageCount + 1;
    let end =
      start + maxShownPageCount - 1 >= totalPage
        ? totalPage
        : start + maxShownPageCount - 1;

    for (let i = start; i <= end; i++) {
      result += `<span ${
        i === this.currentPage ? "class='current-page'" : ""
      }>${i}</span>`;
    }

    if (!isLastPage) {
      result += `<span class="next-page"></span>`;
    }
    result += "</div>";
    return result;
  };
}
