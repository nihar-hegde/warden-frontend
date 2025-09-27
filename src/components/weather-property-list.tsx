"use client";

import { Property } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton"; // 👈 import skeleton

interface Props {
  properties: Property[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export function WeatherPropertyList({
  properties,
  loading,
  error,
  page,
  pageSize,
  total,
  hasNextPage,
  onPageChange,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Loading / Error / Empty */}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && properties.length === 0 && (
        <p className="text-sm text-muted-foreground">No results found.</p>
      )}

      {/* Results or Skeleton */}
      <div className="grid gap-4">
        {loading
          ? // show 6 skeleton cards while loading
            Array.from({ length: 6 }).map((_, idx) => (
              <Card key={idx} className="p-4 space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </Card>
            ))
          : // normal properties
            properties.map((prop) => (
              <Card key={prop.id}>
                <CardHeader>
                  <CardTitle>{prop.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {prop.city}, {prop.state}, {prop.country}
                  </p>
                </CardHeader>
                <CardContent>
                  {prop.weather && (
                    <div className="text-xs text-muted-foreground mb-2">
                      🌡 Temp: {prop.weather.temperature}°C | 💧 Humidity:{" "}
                      {prop.weather.humidity}% |{" "}
                      {prop.weather.weatherGroup
                        ? `☁ ${prop.weather.weatherGroup}`
                        : `Code: ${prop.weather.weathercode}`}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {prop.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Pagination */}
      {!loading && properties.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, page - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <span className="px-3 py-2 text-sm text-muted-foreground">
              Page {page} of {Math.ceil(total / pageSize)}
            </span>
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(page + 1)}
                className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
