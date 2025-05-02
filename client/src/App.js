import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 布局组件
import Header from './components/Header';
import Footer from './components/Footer';

// 屏幕组件
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import BookListScreen from './screens/BookListScreen';
import BookDetailScreen from './screens/BookDetailScreen';
import BookEditScreen from './screens/BookEditScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import BorrowingListScreen from './screens/BorrowingListScreen';
import BorrowingCreateScreen from './screens/BorrowingCreateScreen';
import MyBorrowingsScreen from './screens/MyBorrowingsScreen';
import OverdueBorrowingsScreen from './screens/OverdueBorrowingsScreen';
import CategoryListScreen from './screens/CategoryListScreen';
import CategoryEditScreen from './screens/CategoryEditScreen';

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            
            {/* 图书相关路由 */}
            <Route path="/books" element={<BookListScreen />} />
            <Route path="/books/page/:pageNumber" element={<BookListScreen />} />
            <Route path="/books/:id" element={<BookDetailScreen />} />
            <Route path="/admin/books/:id/edit" element={<BookEditScreen />} />
            
            {/* 用户管理路由 */}
            <Route path="/admin/users" element={<UserListScreen />} />
            <Route path="/admin/users/:id/edit" element={<UserEditScreen />} />
            
            {/* 借阅管理路由 */}
            <Route path="/borrowings" element={<BorrowingListScreen />} />
            <Route path="/borrowings/create" element={<BorrowingCreateScreen />} />
            <Route path="/borrowings/myborrowings" element={<MyBorrowingsScreen />} />
            <Route path="/borrowings/overdue" element={<OverdueBorrowingsScreen />} />
            
            {/* 分类管理路由 */}
            <Route path="/admin/categories" element={<CategoryListScreen />} />
            <Route path="/admin/categories/:id/edit" element={<CategoryEditScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </Router>
  );
}

export default App; 