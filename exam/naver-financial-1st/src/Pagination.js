import { DEFAULT_PARAM_VALUE, MAX_TOTAL_PAGE } from "./constants.js";

import { checkValidParam } from "./utils.js";

export default function Pagination(params = {}) {
  params = checkValidParam(params);

  this.state = {
    currentPage: params.currentPage ?? DEFAULT_PARAM_VALUE.currentPage,
    totalItemCount: params.totalItemCount ?? DEFAULT_PARAM_VALUE.totalItemCount,
    pagePerItemCount:
      params.pagePerItemCount ?? DEFAULT_PARAM_VALUE.pagePerItemCount,
  };

  this.setState = (nextStateParam) => {
    if (JSON.stringify(this.state) !== JSON.stringify(nextStateParam)) {
      nextStateParam = checkValidParam(nextStateParam);
      this.state = { ...this.state, ...nextStateParam };
    }
  };

  this.render = () => {
    console.log(this.state);
    const { currentPage, totalItemCount, pagePerItemCount } = this.state;

    const totalPage = this.getTotalPage(totalItemCount, pagePerItemCount);

    const pageBoundation = this.getCurrentPageBoundation(
      totalPage,
      currentPage
    );

    if (totalItemCount === 0) return `<div></div>`;

    return `
      <div>
        ${this.getPageSpan(pageBoundation, currentPage)}
      </div>
    `;
  };

  /**
   * 현재 매개변수들이 가질 수 있는 총 페이지 수를 반환합니다.
   */
  this.getTotalPage = (totalItemCount, pagePerItemCount) =>
    Math.ceil(totalItemCount / pagePerItemCount);

  /**
   * 현재 매개변수로 가질 수 있는 페이지의 경계 값을 배열로 반환합니다.
   *
   * 만약, MAX_TOTAL_PAGE 보다 totalPage가 작을 경우,
   * 해당 totalPage 만큼의 페이지 경계값을 반환합니다.
   *
   * 만약, MAX_TOTAL_PAGE 보다 totalPage가 클 경우,
   * paginationIndex를 비교합니다.
   *
   * paginationIndex가 최대 값보다 작을 경우, 10개의 값을 가진 배열을 반환합니다.
   * 클 경우, 마지막 pagination index로 가질 수 있는 값을 가진 배열을 반환합니다.
   */
  this.getCurrentPageBoundation = (totalPage, currentPage) => {
    let pages;

    if (totalPage <= MAX_TOTAL_PAGE) {
      pages = [...Array(totalPage).keys()].map((_, idx) => idx + 1);
    } else {
      const paginationIndex = Math.floor((currentPage - 1) / 10);
      const lastPaginationIndex = Math.floor(totalPage / 10);

      if (paginationIndex < lastPaginationIndex) {
        pages = [...Array(MAX_TOTAL_PAGE).keys()].map((_, idx) => {
          return idx + 1 + paginationIndex * 10;
        });
      } else {
        const lastPaginationPages = totalPage - paginationIndex * 10;
        pages = [...Array(lastPaginationPages).keys()].map((_, idx) => {
          return idx + 1 + paginationIndex * 10;
        });
      }
    }

    return pages;
  };

  /**
   * 현재 매개변수가 가질 수 있는 페이지 HTML string을 반환합니다.
   * 만약, currentPage가 생성할 수 있는 page의 범위를 넘은 경우,
   * 가장 마지막 페이지 값으로 변경하여 처리합니다.
   */
  this.getPageSpan = (pageBoundation, currentPage) => {
    if (currentPage > pageBoundation[pageBoundation.length - 1]) {
      currentPage = pageBoundation[pageBoundation.length - 1];
    }

    const spans = [];

    if (currentPage > 1) {
      spans.push('<span class="prev-page"></span>');
    }

    pageBoundation.forEach((curr) => {
      let span;
      if (curr === currentPage)
        span = `<span class="current-page">${curr}</span>`;
      else span = `<span>${curr}</span>`;
      spans.push(span);
    });

    if (currentPage !== pageBoundation[pageBoundation.length - 1]) {
      spans.push('<span class="next-page"></span>');
    }

    return spans.join("");
  };
}
