
'use client'
import { CrmSidebar } from "@/components/crm-sidebar";
import * as React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CrmLayout({ children }: { children: React.ReactNode }) {
    const { i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';

    // State to manage the sidebar's collapsed state, persisted in localStorage.
    const [isCollapsed, setIsCollapsed] = React.useState(() => {
        if (typeof window !== "undefined") {
            return window.localStorage.getItem("sidebar-collapsed") === "true";
        }
        return false;
    });

    // Effect to save the collapsed state to localStorage whenever it changes.
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem("sidebar-collapsed", String(isCollapsed));
        }
    }, [isCollapsed]);

    // Function to toggle the sidebar state.
    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    // Dynamically calculate the sidebar width for use in styles.
    const sidebarWidth = isCollapsed ? "60px" : "280px";
    
    const contentMargin = {
        [isRtl ? 'marginRight' : 'marginLeft']: sidebarWidth
    };
    
    const buttonPosition = {
        [isRtl ? 'right' : 'left']: `calc(-${sidebarWidth} / 2 - -12px)`
    };

    return (
        <div className="w-full min-h-screen flex bg-background">
            {/* The collapsible sidebar component */}
            <CrmSidebar isCollapsed={isCollapsed} />
            
            {/* Main content area that resizes dynamically */}
            <div 
                className="flex-1 flex flex-col transition-[margin] duration-300 ease-in-out relative"
                style={contentMargin}
            >
                 {/* The toggle button is part of the main layout to correctly position it */}
                 <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-6 -translate-y-1/2 bg-background hover:bg-muted rounded-full hidden md:flex"
                    style={{ ...buttonPosition, transition: 'left 0.3s ease-in-out, right 0.3s ease-in-out', zIndex: 10 }}
                    onClick={toggleSidebar}
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isRtl ? (
                        isCollapsed ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />
                    ) : (
                        isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />
                    )}
                </Button>

                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
