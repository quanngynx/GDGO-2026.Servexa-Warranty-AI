import * as React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { technicianApi } from "@/libs/api/human-resources/technician/api";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@servexa-warranty-ai/ui/components/combobox";
import { Loader2 } from "lucide-react";
import { useDebouncedCallback } from "@servexa-warranty-ai/ui/hooks/use-debounced-callback";
import { useTranslation } from "react-i18next";

export function SelectTechnician({
  value,
  onValueChange,
  className,
}: {
  value?: string | null;
  onValueChange?: (value: string) => void;
  className?: string;
}) {
    const { t } = useTranslation();
  const [inputValue, setInputValue] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  const updateSearch = useDebouncedCallback((val: string) => {
    setDebouncedSearch(val);
  }, 500);

  const handleInputValueChange = (val: string) => {
    setInputValue(val);
    updateSearch(val);
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["technicians", "infinite", debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await technicianApi.findAll({ 
        page: pageParam, 
        limit: 20,
        search: debouncedSearch || undefined,
      });
      if (!res) {
        throw new Error('Failed to fetch technicians');
      }
      return res.metadata;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });

  const observerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "100px" }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const technicians = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  return (
    <div className={className}>
      <Combobox 
        value={value || undefined} 
        onValueChange={(val: any) => onValueChange?.(val as string)}
        inputValue={inputValue}
        onInputValueChange={handleInputValueChange}
      >
        <ComboboxInput 
          placeholder={isLoading && !technicians.length ? "Loading..." : "Search technicians..."}
          showClear={true}
        />
        <ComboboxContent>
          {technicians.length === 0 && !isLoading && !isFetchingNextPage ? (
            <ComboboxEmpty>{t("No technicians found.")}</ComboboxEmpty>
          ) : (
            <ComboboxList>
              {technicians.map((technician) => (
                <ComboboxItem key={technician.id} value={technician.id}>
                  {technician.user?.fullName || technician.user?.username || "Unknown Technician"}
                </ComboboxItem>
              ))}
              {isFetchingNextPage && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
              <div ref={observerRef} className="h-1 w-full" />
            </ComboboxList>
          )}
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
