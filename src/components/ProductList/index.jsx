import { useState } from "react";

import { Header } from "components/commons";
import { useFetchProducts } from "hooks/reactQuery/useProductsApi";
import useDebounce from "hooks/useDebounce";
import { Search } from "neetoicons";
import { Spinner, Input, NoData, Pagination } from "neetoui";
import { isEmpty } from "ramda";

import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_INDEX } from "./constants";
import ProductListItem from "./ProductListItem";

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE_INDEX);
  const [searchKey, setSearchKey] = useState("");

  const debouncedSearchKey = useDebounce(searchKey);

  const { data: { products = [], totalProductsCount } = {}, isLoading } =
    useFetchProducts({
      searchTerm: debouncedSearchKey,
      page: currentPage,
      pageSize: DEFAULT_PAGE_SIZE,
    });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Header
        shouldShowBackButton={false}
        title="Smile cart"
        actionBlock={
          <Input
            placeholder="Search products"
            prefix={<Search />}
            type="search"
            value={searchKey}
            onChange={e => {
              setSearchKey(e.target.value);
              setCurrentPage(DEFAULT_PAGE_INDEX);
            }}
          />
        }
      />
      {isEmpty(products) ? (
        <NoData className="h-full w-full" title="No products to show" />
      ) : (
        <div className="grid grid-cols-2 justify-items-center gap-y-8 p-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map(product => (
            <ProductListItem key={product.slug} {...product} />
          ))}
        </div>
      )}
      <div className="mb-5 self-end">
        <Pagination
          count={totalProductsCount}
          navigate={page => setCurrentPage(page)}
          pageNo={currentPage}
          pageSize={DEFAULT_PAGE_SIZE}
        />
      </div>
    </div>
  );
};

export default ProductList;
