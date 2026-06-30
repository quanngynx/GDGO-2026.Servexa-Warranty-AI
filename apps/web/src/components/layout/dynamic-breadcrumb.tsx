import { useRouterState, Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@servexa-warranty-ai/ui/components/breadcrumb";

type BreadcrumbContext = {
  getTitle?: () => string;
  title?: string;
};

export function DynamicBreadcrumb() {
  const matches = useRouterState({
    select: (state) => state.matches,
  });

  // Filter matches that have breadcrumb context and map to breadcrumb items
  const breadcrumbs = matches
    .filter((match) => {
      const context = match.context as BreadcrumbContext;
      return context?.getTitle || context?.title;
    })
    .map((match) => {
      const context = match.context as BreadcrumbContext;
      const title = context?.getTitle?.() || context?.title || "";
      return {
        title,
        pathname: match.pathname,
        routeId: match.routeId,
      };
    })
    .filter((breadcrumb, index, self) => {
      // Remove consecutive duplicates that occur due to layout routes inheriting context
      if (index === 0) return true;
      return breadcrumb.title !== self[index - 1].title;
    });

  // Don't render if there are no breadcrumbs or only one (home)
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <div key={breadcrumb.routeId} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={breadcrumb.pathname}>{breadcrumb.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
