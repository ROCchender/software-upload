import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown, Form, Button } from 'react-bootstrap';
import { logout } from '../actions/userActions';
import { FaBook, FaSignInAlt, FaUserPlus, FaUser, FaClipboardList, FaUsers, FaBoxes } from 'react-icons/fa';

const Header = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <FaBook className="me-2" /> 校园图书管理系统
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/books">
                <Nav.Link>
                  <FaBook className="me-1" /> 图书目录
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <>
                  <LinkContainer to="/borrowings/myborrowings">
                    <Nav.Link>
                      <FaClipboardList className="me-1" /> 我的借阅
                    </Nav.Link>
                  </LinkContainer>
                  
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>
                        <FaUser className="me-1" /> 个人信息
                      </NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      <FaSignInAlt className="me-1" /> 退出登录
                    </NavDropdown.Item>
                  </NavDropdown>
                  
                  {/* 管理员或图书管理员菜单 */}
                  {userInfo.role === 'admin' || userInfo.role === 'librarian' ? (
                    <NavDropdown title="管理" id="adminmenu">
                      <LinkContainer to="/borrowings">
                        <NavDropdown.Item>
                          <FaClipboardList className="me-1" /> 借阅管理
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/borrowings/create">
                        <NavDropdown.Item>
                          <FaClipboardList className="me-1" /> 新增借阅
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/borrowings/overdue">
                        <NavDropdown.Item>
                          <FaClipboardList className="me-1" /> 逾期记录
                        </NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <LinkContainer to="/admin/categories">
                        <NavDropdown.Item>
                          <FaBoxes className="me-1" /> 分类管理
                        </NavDropdown.Item>
                      </LinkContainer>
                      {userInfo.role === 'admin' && (
                        <LinkContainer to="/admin/users">
                          <NavDropdown.Item>
                            <FaUsers className="me-1" /> 用户管理
                          </NavDropdown.Item>
                        </LinkContainer>
                      )}
                    </NavDropdown>
                  ) : null}
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <FaSignInAlt className="me-1" /> 登录
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link>
                      <FaUserPlus className="me-1" /> 注册
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;