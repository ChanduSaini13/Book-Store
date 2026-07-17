import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout.js';
import { booksAPI, categoriesAPI } from '../../services/api.js';
import { Button } from '../../components/common/Button.js';
import { Input } from '../../components/common/Input.js';
import { Select } from '../../components/common/Select.js';
import { TextArea } from '../../components/common/TextArea.js';
import { Modal, ConfirmModal } from '../../components/common/Modal.js';
import { useModal } from '../../hooks/useModal.js';
import { showToast } from '../../utils/toast.js';
import { TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { Book, Category } from '../../types/index.js';

const AdminBooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    categoryId: '',
  });
  const modalCreate = useModal();
  const modalEdit = useModal();
  const modalDelete = useModal();
  const [deleteBook, setDeleteBook] = useState<Book | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [booksResponse, categoriesResponse] = await Promise.all([
        booksAPI.getBooks(1, 100),
        categoriesAPI.getCategoryTree(),
      ]);
      setBooks(booksResponse.data.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      showToast('Failed to load data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const flattenCategories = (cats: Category[], result: any[] = []): any[] => {
    cats.forEach((cat) => {
      if (cat.level === 3) {
        result.push({ id: cat.id, name: cat.name });
      }
      if (cat.children) {
        flattenCategories(cat.children, result);
      }
    });
    return result;
  };

  const leafCategories = flattenCategories(categories);

  const handleCreate = () => {
    setFormData({ title: '', author: '', description: '', categoryId: '' });
    setSelectedBook(null);
    modalCreate.open();
  };

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      categoryId: book.categoryId,
    });
    modalEdit.open();
  };

  const handleSave = async () => {
    if (!formData.title || !formData.author || !formData.description || !formData.categoryId) {
      showToast('All fields are required', 'error');
      return;
    }

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('author', formData.author);
      form.append('description', formData.description);
      form.append('categoryId', formData.categoryId);
      // coverImage uploads removed — backend will use default cover

      if (selectedBook) {
        await booksAPI.updateBook(selectedBook.id, form);
        showToast('Book updated successfully', 'success');
        modalEdit.close();
      } else {
        await booksAPI.createBook(form);
        showToast('Book created successfully', 'success');
        modalCreate.close();
      }

      await fetchData();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to save book', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteBook) return;

    try {
      await booksAPI.deleteBook(deleteBook.id);
      showToast('Book deleted successfully', 'success');
      modalDelete.close();
      await fetchData();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to delete book', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Books Management</h1>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Add Book
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Author</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{book.author}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{book.category?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(book)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteBook(book);
                            modalDelete.open();
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={modalCreate.isOpen || modalEdit.isOpen}
          onClose={() => {
            modalCreate.close();
            modalEdit.close();
          }}
          title={selectedBook ? 'Edit Book' : 'Add New Book'}
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
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Book title"
            />

            <Input
              label="Author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Author name"
            />

            <TextArea
              label="Description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Book description"
              rows={4}
            />

            <Select
              label="Category"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              options={leafCategories.map((cat) => ({ value: cat.id, label: cat.name }))}
            />

            {/* Cover image uploads removed — using a single default cover image for all books */}
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={modalDelete.isOpen}
          onClose={modalDelete.close}
          onConfirm={handleDelete}
          title="Delete Book"
          message={`Are you sure you want to delete "${deleteBook?.title}"?`}
          confirmText="Delete"
          isDangerous
        />
      </div>
    </AdminLayout>
  );
};

export default AdminBooksPage;
