"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { USERS_API } from '@/app/constants';
import PaginationControls from './components/pagination-controls';

interface User {
  Company: string;
  Email: string;
  EmailAddress: string;
  FirstNameLastName: string;
  ID: string;
  JobTitle: string;
  Phone: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pageNumbers, setPageNumbers] = useState([1,2,3,4,5])
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUsers('initial');
  }, []);

  const getUsers = async (action: string, pageNumber = 1) => {
    let nextPageNumber = determineNextPageNumber(action, currentPage, pageNumber);

    setLoading(true);
    setError(null);
    setCurrentPage(nextPageNumber);

    try {
      const request = await axios.get(`${USERS_API}/users/${nextPageNumber}/next`);
      const { data = {} } = request || {};
      const { users = [] } = data;
      setUsers(users);
      if(action === 'next'){
        const tempPageNumbers = pageNumbers.map(num => num + 1);
        setPageNumbers(tempPageNumbers);
      } else if (action === 'prev'){
        const tempPageNumbers = pageNumbers.map(num => num - 1);
        setPageNumbers(tempPageNumbers);
      }
    } catch (error) {
      console.log("Failed to fetch users", error);
      setUsers([]);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const determineNextPageNumber = (action: string, currentPage: number, pageNumber: number) => {
    switch (action) {
      case "initial":
        return currentPage;
      case "next":
        return currentPage + 1;
      case "direct":
        return pageNumber;
      case "prev":
        return currentPage - 1;
      default:
        return currentPage;
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white" style={{minHeight: '448px'}}>
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Job Title</th>
              <th className="py-2 px-4 border-b text-left">Company</th>
              <th className="py-2 px-4 border-b text-left">Phone</th>
            </tr>
          </thead>
          <tbody className={`${loading ? 'opacity-40' : ''}`}>
            {error ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-red-500">{error}</td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user: User) => (
                <tr key={user.ID}>
                  <td className="py-2 px-4 border-b text-left">{user.ID}</td>
                  <td className="py-2 px-4 border-b text-left">{user.FirstNameLastName}</td>
                  <td className="py-2 px-4 border-b text-left">{user.Email}</td>
                  <td className="py-2 px-4 border-b text-left">{user.JobTitle}</td>
                  <td className="py-2 px-4 border-b text-left">{user.Company}</td>
                  <td className="py-2 px-4 border-b text-left">{user.Phone}</td>
                </tr>
              ))
            ) : !loading && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-red-500">No users found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <PaginationControls
        pageNumbers={pageNumbers}
        getUsers={getUsers}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Users;