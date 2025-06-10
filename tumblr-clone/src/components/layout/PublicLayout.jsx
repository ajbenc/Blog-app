import { Outlet } from "react-router-dom";

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-[#131313] flex items-center justify-center">
            <main className="w-full max-w-md p-6">
                
                {/* Render child routes */}
                <div className="bg-[#1a1a1a] rounded-lg shadow-lg p-6 border border-[#2f2f2f]">
                    <Outlet />
                </div>
                
                {/* Footer */}
                <div className="mt-8 text-center text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} BlogMaster. All rights reserved.</p>
                </div>
            </main>
        </div>
    );
}