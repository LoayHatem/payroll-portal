import Image from "next/image";
import Link from "next/link";
import { FaChartLine, FaWallet, FaLightbulb } from "react-icons/fa";
import { RiDashboardLine } from "react-icons/ri";
import { BiLogIn } from "react-icons/bi";
import { HiOutlineUserAdd } from "react-icons/hi";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600"
          >
            YourApp
          </Link>
          <div className="space-x-4 flex items-center">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-blue-600 flex items-center"
            >
              <RiDashboardLine className="mr-1" />
              Dashboard
            </Link>
            <Link
              href="/login"
              className="text-gray-600 hover:text-blue-600 flex items-center"
            >
              <BiLogIn className="mr-1" />
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 flex items-center"
            >
              <HiOutlineUserAdd className="mr-1" />
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="bg-gray-100 py-20 flex">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">The everyday platform for people at work</h1>
              <Link
                href="/signup"
                className="text-red-500 text-xl"
              >
                Learn more ↓
              </Link>
            </div>
            <div className="w-[300px] flex justify-center min-h-[500px]">
              <div className="relative w-64 h-128 bg-black rounded-3xl overflow-hidden">
                <div className="absolute inset-1 bg-white rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-br from-pink-500 to-red-500 h-1/2 flex items-center justify-center">
                    <div className="text-white text-2xl font-bold">
                      Hello &<br />
                      Welcome
                    </div>
                  </div>
                  <div className="h-1/2 flex items-end justify-center pb-8">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <FaWallet className="text-3xl text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold">Easy Budgeting</h3>
                </div>
                <p className="text-gray-600">Create and manage your budgets with our intuitive interface.</p>
              </div>
              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <FaChartLine className="text-3xl text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold">Expense Tracking</h3>
                </div>
                <p className="text-gray-600">Keep track of your expenses and categorize them automatically.</p>
              </div>
              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <FaLightbulb className="text-3xl text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold">Financial Insights</h3>
                </div>
                <p className="text-gray-600">Get valuable insights into your spending habits and financial health.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <Image
                  src="/dashboard-preview.jpg"
                  alt="Dashboard Preview"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="md:w-1/2 md:pl-12">
                <h2 className="text-3xl font-bold mb-6">Powerful Dashboard</h2>
                <p className="text-gray-600 mb-6">
                  Our comprehensive dashboard gives you a complete overview of your financial situation at a glance. Visualize your
                  income, expenses, and savings goals with beautiful charts and graphs.
                </p>
                <Link
                  href="/dashboard"
                  className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700"
                >
                  View Demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2023 YourApp. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/privacy"
                className="hover:text-blue-400"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-blue-400"
              >
                Terms of Service
              </Link>
              <Link
                href="/contact"
                className="hover:text-blue-400"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
