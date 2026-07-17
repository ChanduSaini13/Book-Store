import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout.js';
import { categoriesAPI } from '../../services/api.js';
import { Button } from '../../components/common/Button.js';
import { Input } from '../../components/common/Input.js';
import { Select } from '../../components/common/Select.js';
import { Modal, ConfirmModal } from '../../components/common/Modal.js';
import { useModal } from '../../hooks/useModal.js';
import { showToast } from '../../utils/toast.js';
import { TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { Category } from '../../types/index.js';

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', parentId: '' });
  const modalCreate = useModal();
  const modalEdit = useModal();
  const modalDelete = useModal();
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await categoriesAPI.getCategoryTree();
      setCategories(response.data);
    } catch (error) {
      showToast('Failed to load categories', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getAllCategories = (cats: Category[], result: Category[] = []): Category[] => {
    cats.forEach((cat) => {
      result.push(cat);
      if (cat.children) {
        getAllCategories(cat.children, result);
      }
    });
    return result;
  };

  const getCategoriesUpToLevel = (level: number) => {
    return getAllCategories(categories).filter((cat) => cat.level < level);
  };

  const handleCreate = () => {
    setFormData({ name: '', parentId: '' });
    setSelectedCategory(null);
    modalCreate.open();
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      parentId: category.parentId || '',
    });
    modalEdit.open();
  };

  const handleSave = async () => {
    if (!formData.name) {
      showToast('Category name is required', 'error');
      return;
    }

    try {
      const data = {
        name: formData.name,
        parentId: formData.parentId || undefined,
      };

      if (selectedCategory) {
        await categoriesAPI.updateCategory(selectedCategory.id, data);
        showToast('Category updated successfully', 'success');
        modalEdit.close();
      } else {
        await categoriesAPI.createCategory(data);
        showToast('Category created successfully', 'success');
        modalCreate.close();
      }

      await fetchCategories();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to save category', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;

    try {
      await categoriesAPI.deleteCategory(deleteCategory.id);
      showToast('Category deleted successfully', 'success');
      modalDelete.close();
      await fetchCategories();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to delete category', 'error');
    }
  };

  const renderCategoryTree = (cats: Category[]) => (
    <ul className="space-y-2">
      {cats.map((cat) => (
        <li key={cat.id} className={`ml-${(cat.level - 1) * 4}`}>
          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div>
              <p className="font-medium text-gray-900">{cat.name}</p>
              <p className="text-xs text-gray-500">Level {cat.level}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(cat)}
                className="text-blue-600 hover:text-blue-700"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setDeleteCategory(cat);
                  modalDelete.open();
                }}
                className="text-red-600 hover:text-red-700"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          {cat.children && cat.children.length > 0 && (
            <div className="mt-2">{renderCategoryTree(cat.children)}</div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Add Category
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories found</p>
          </div>
        ) : (
          <div className="space-y-2">{renderCategoryTree(categories)}</div>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={modalCreate.isOpen || modalEdit.isOpen}
          onClose={() => {
            modalCreate.close();
            modalEdit.close();
          }}
          title={selectedCategory ? 'Edit Category' : 'Add New Category'}
          footer={
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  modalCreate.close();
                  modalEdit.close();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Category name"
            />

            {selectedCategory && selectedCategory.level < 3 ? (
              <Select
                label="Parent Category"
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                options={getCategoriesUpToLevel(selectedCategory.level).map((cat) => ({
                  value: cat.id,
                  label: `${cat.name} (Level ${cat.level})`,
                }))}
              />
            ) : !selectedCategory && formData.parentId === '' ? (
              <Select
                label="Parent Category (Optional)"
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                options={getAllCategories(categories)
                  .filter((cat) => cat.level < 3)
                  .map((cat) => ({
                    value: cat.id,
                    label: `${cat.name} (Level ${cat.level})`,
                  }))}
              />
            ) : null}
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={modalDelete.isOpen}
          onClose={modalDelete.close}
          onConfirm={handleDelete}
          title="Delete Category"
          message={`Are you sure you want to delete "${deleteCategory?.name}"?`}
          confirmText="Delete"
          isDangerous
        />
      </div>
    </AdminLayout>
  );
};

export default AdminCategoriesPage;
