import * as React from "react";
import { useEffect } from "react"; // Import useEffect for fetching data
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

type Category = {
  _id: string;
  title: string;
};

export function AppSidebar({
  dir = "ltr",
  ...props
}: React.ComponentProps<typeof Sidebar> & { dir?: "ltr" | "rtl" }) {
  const t = useTranslations("Sidebar");
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  const pathname = usePathname();

  const [categories, setCategories] = React.useState<string[]>([]);
  const [newCategory, setNewCategory] = React.useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  // Assuming you store the token in localStorage or some other secure location
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://192.168.50.142:3000/api/auth/dashboard",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Pass token in Authorization header
            },
          }
        );

        console.log("Response status:", response.status);

        const data = await response.json(); // Parse the response JSON once
        console.log("Backend response:", data);
        console.log("Categories:", categories);

        if (response.ok) {
          console.log("Categories fetched:", data); // Log the response
          setCategories(data.categories || []); // Use the parsed data
        } else {
          console.error(
            "Failed to fetch categories:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (token) {
      fetchCategories();
    } else {
      console.warn("No token available. Unable to fetch categories.");
    }
  }, [token]);

  const handleAddCategory = async () => {
    const trimmedCategory = newCategory.trim();
    if (!trimmedCategory || trimmedCategory.length < 3) {
      alert("Category name must be at least 3 characters long.");
      return;
    }

    try {
      const response = await fetch(
        "http://192.168.50.142:3000/api/auth/category",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add your token here
          },
          body: JSON.stringify({ title: trimmedCategory }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Category created:", data);

        // Update the categories state with the new category
        setCategories((prevCategories) => [...prevCategories, data]); // Use the response data

        // Clear the input field and close the dialog
        setNewCategory("");
        setIsAddDialogOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to create category:", errorData.message);
        alert(`Failed to create category: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating category:", error);
      alert("An unexpected error occurred while creating the category.");
    }
  };

  const handleEditCategory = async (id?: string) => {
    // Change id type to string
    console.log("Editing category with ID:", id); // Check if the ID is correct
    if (!id) {
      console.error("No ID provided to handleEditCategory.");
      alert("An error occurred: Missing category ID.");
      return;
    }

    const newName = prompt("Enter the new category name:");
    if (!newName || !newName.trim()) {
      alert("Category name cannot be empty.");
      return;
    }

    console.log("Frontend - Category ID:", id);
    console.log("Frontend - New Title:", newName);

    try {
      const response = await fetch(
        `http://192.168.50.142:3000/api/auth/category/${id}`, // Fixed endpoint URL
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: newName.trim() }),
        }
      );

      if (response.ok) {
        const updatedCategory: Category = await response.json();
        console.log("Frontend - Response Data:", updatedCategory);

        // Update the local categories state with the updated category
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === id ? { ...cat, title: updatedCategory.title } : cat
          )
        );
        alert("Category updated successfully.");
      } else {
        const errorData = await response.json();
        console.error("Failed to update category:", errorData);
        alert(`Failed to update category: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("An unexpected error occurred.");
    }
  };

  const handleDeleteCategory = async (_id: string) => {
    // Ask for confirmation
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      // Make the DELETE request
      const response = await fetch(
        `http://192.168.50.142:3000/api/auth/category/${_id}`, // Ensure this URL is correct
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Log the response to check if it's successful
      console.log("Delete Response Status:", response.status);
      console.log("Delete Response Body:", await response.text());

      // Check if the response is successful (status code 200 or 204)
      if (response.ok) {
        // Update local categories state to remove the deleted category
        setCategories((prev) => prev.filter((cat) => cat._id !== _id));
        alert("Category deleted successfully.");
      } else {
        console.error("Failed to delete category:", response.statusText);
        alert("Failed to delete category.");
      }
    } catch (error) {
      // Log any error that occurs during the fetch operation
      console.error("Error deleting category:", error);
      alert("An unexpected error occurred while deleting the category.");
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      side={dir === "rtl" ? "right" : "left"}
      {...props}
    >
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/merge-blue.png"
            alt="Company Logo"
            width={40}
            height={40}
          />
          {isExpanded && <span className="font-semibold">Merge Admin</span>}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span className={isExpanded ? "" : "sr-only"}>Categories</span>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-md mb-3 w-6 h-6 ${
                    isExpanded ? "" : "ml-auto"
                  }`}
                >
                  <span className="h-4 w-4">+</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter category name"
                  />
                  <Button onClick={handleAddCategory}>Add</Button>
                </div>
              </DialogContent>
            </Dialog>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => (
                <SidebarMenuItem
                  key={category._id}
                  className="flex items-center justify-between"
                >
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === `/${category.title.toLowerCase()}`}
                    className="flex-grow"
                  >
                    <Link
                      href={`/categories/${category._id}`}
                      className="flex items-center w-full"
                    >
                      {isExpanded && <span>{category.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                  {/* Edit and Delete Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        console.log("Editing category with ID:", category._id); // Log the ID
                        handleEditCategory(category._id); // Pass _id
                      }}
                      className="rounded-md"
                    >
                      Editt
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteCategory(category._id)} // Use _id for delete
                      className="rounded-md"
                    >
                      Delete
                    </Button>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton asChild>
          <Link href="#" className="flex items-center w-full">
            <LogOut className={isExpanded ? "mr-2" : ""} />
            {isExpanded && <span>{t("logout")}</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
