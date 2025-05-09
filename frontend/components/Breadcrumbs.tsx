"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

export function Breadcrumbs() {
  const pathname = usePathname();
  let segments = pathname.split("/").filter(Boolean);

  // Удалим сегмент "home", если он идёт после "/"
  if (segments[0]?.toLowerCase() === "home") {
    segments = segments.slice(1);
  }

  return (
    <Breadcrumb className="select-none">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage className="capitalize">Home</BreadcrumbPage>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const label = decodeURIComponent(segment).replace(/-/g, " ");

          return (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">{label}</BreadcrumbPage>
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
