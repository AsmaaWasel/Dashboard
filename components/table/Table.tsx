"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowUpDown, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ServiceProviderForm from "../form/Form";

interface Data {
  id: number;
  title: string;
  image: string;
  country: string;
  phone: string;
  description: string;
}

const mockData: Data[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  title: `Service ${i + 1}`,
  image: `/placeholder.svg?height=50&width=50`,
  country: ["USA", "UK", "Canada", "Australia", "Germany"][i % 5],
  phone: `+1 ${Math.floor(Math.random() * 1000)}-${Math.floor(
    Math.random() * 1000
  )}-${Math.floor(Math.random() * 10000)}`,
  description: `This is a description for service ${
    i + 1
  }. It provides additional information about the service.`,
}));

export default function TableDesign() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Data;
    direction: "asc" | "desc";
  } | null>(null);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [services, setServices] = useState<Data[]>(mockData);
  const [editingService, setEditingService] = useState<Data | null>(null);

  const getCurrentLocale = () => {
    if (typeof window !== "undefined") {
      return document.cookie.match(/locale=([^;]*)/)?.[1] || "en";
    }
    return "en";
  };

  const [locale, setLocale] = useState(getCurrentLocale());
  const direction = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const checkLocale = () => {
      const newLocale = getCurrentLocale();
      if (newLocale !== locale) {
        setLocale(newLocale);
      }
    };

    const intervalId = setInterval(checkLocale, 100);
    return () => clearInterval(intervalId);
  }, [locale]);

  // Sort data
  const sortedData = [...services].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 3) {
      // If total pages is 3 or less, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage === 1) {
        // At first page: 1 2 ... last
        pageNumbers.push(1, 2, "...", totalPages);
      } else if (currentPage === totalPages) {
        // At last page: 1 ... secondLast last
        pageNumbers.push(1, "...", totalPages - 1, totalPages);
      } else if (currentPage === 2) {
        // At second page: 1 2 3 ... last
        pageNumbers.push(1, 2, 3, "...", totalPages);
      } else if (currentPage === totalPages - 1) {
        // At second-to-last page: 1 ... secondLast last
        pageNumbers.push(1, "...", totalPages - 1, totalPages);
      } else {
        // In middle: 1 ... current ... last
        pageNumbers.push(1, "...", currentPage, "...", totalPages);
      }
    }

    return pageNumbers;
  };

  // Handle sorting
  const handleSort = (key: keyof Data) => {
    setSortConfig({
      key,
      direction:
        sortConfig?.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleEdit = (id: number) => {
    const serviceToEdit = services.find((service) => service.id === id);
    if (serviceToEdit) {
      setEditingService(serviceToEdit);
      setIsServiceDialogOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    setServices(services.filter((service) => service.id !== id));
  };

  const handleAddService = () => {
    setEditingService(null);
    setIsServiceDialogOpen(true);
  };

  const handleServiceSubmit = (formData: any) => {
    if (editingService) {
      // Update existing service
      setServices(
        services.map((service) =>
          service.id === editingService.id
            ? { ...service, ...formData }
            : service
        )
      );
    } else {
      // Add new service
      const newService: Data = {
        id: services.length + 1,
        title: formData.title,
        image: formData.image
          ? URL.createObjectURL(formData.image)
          : "/placeholder.svg?height=50&width=50",
        country: formData.country,
        phone: formData.provider, // Using provider as phone for this example
        description: formData.description,
      };
      setServices([...services, newService]);
    }
    setIsServiceDialogOpen(false);
    setEditingService(null);
  };

  const t = useTranslations("TableFooter");

  return (
    <div className="w-full mx-auto space-y-4 z-[-1]">
      <div className="flex justify-end mb-4">
        <Dialog
          open={isServiceDialogOpen}
          onOpenChange={setIsServiceDialogOpen}
        >
          <DialogTrigger asChild>
            <Button onClick={handleAddService}>
              <Plus className="mr-2 h-4 w-4" /> Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <ServiceProviderForm
              onSubmit={handleServiceSubmit}
              initialData={editingService}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center gap-1">
                  ID
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center gap-1">
                  Title
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Image</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("country")}
              >
                <div className="flex items-center gap-1">
                  Country
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("phone")}
              >
                <div className="flex items-center gap-1">
                  Phone
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("description")}
              >
                <div className="flex items-center gap-1">
                  Description
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>
                  <Image
                    src={row.image}
                    alt={row.title}
                    width={50}
                    height={50}
                  />
                </TableCell>
                <TableCell>{row.country}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {row.description.slice(0, 50)}...
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(row.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(row.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{t("show")}</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => {
              setRowsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm font-medium">{t("entires")}</span>
        </div>

        <div className="text-sm text-muted-foreground">
          {t("numberOfEntries", {
            startIndex: startIndex + 1,
            endIndex: Math.min(endIndex, sortedData.length),
            totalEntries: sortedData.length,
          })}
        </div>

        <div className="flex items-center gap-1" style={{ direction }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            {locale === "ar" ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>

          {getPageNumbers().map((pageNum, index) =>
            typeof pageNum === "number" ? (
              <Button
                key={index}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className="min-w-[32px]"
              >
                {pageNum}
              </Button>
            ) : (
              <span key={index} className="px-1 text-gray-500">
                {pageNum}
              </span>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            {locale === "ar" ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
