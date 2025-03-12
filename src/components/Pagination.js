import Pagination from "react-bootstrap/Pagination";
import Link from "next/link";
import { useRouter } from "next/router";

export default function PaginationComponent({
  totalPages,
  currentPage = 1,
  baseUrl,
}) {
  currentPage = parseInt(currentPage, 10);
  totalPages = parseInt(totalPages, 10);

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };
  if (totalPages <= 1) return null;

  return (
    <Pagination className='mt-4 justify-content-center'>
      <Link href={`${baseUrl}/1`} passHref legacyBehavior>
        <Pagination.First disabled={currentPage === 1} />
      </Link>

      <Link
        href={`${baseUrl}/${Math.max(1, currentPage - 1)}`}
        passHref
        legacyBehavior
      >
        <Pagination.Prev disabled={currentPage === 1} />
      </Link>

      {getPageNumbers().map((page, index) => {
        if (page === "...") {
          return <Pagination.Ellipsis key={`ellipsis-${index}`} />;
        }

        return (
          <Link href={`${page}`} key={page} passHref legacyBehavior>
            <Pagination.Item as='a' active={currentPage === page}>
              {page}
            </Pagination.Item>
          </Link>
        );
      })}

      <Link
        href={`${Math.min(totalPages, currentPage + 1)}`}
        passHref
        legacyBehavior
      >
        <Pagination.Next as='a' disabled={currentPage === totalPages} />
      </Link>

      <Link href={`${totalPages}`} passHref legacyBehavior>
        <Pagination.Last as='a' disabled={currentPage === totalPages} />
      </Link>
    </Pagination>
  );
}
