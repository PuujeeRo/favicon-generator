'use client';

import React, { useEffect, useState } from 'react';
import { Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { Dropdown, DropdownItem, DropdownTrigger, DropdownMenu } from "@nextui-org/dropdown";
import { Button } from '@nextui-org/button'
import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { FaChevronDown, FaBalanceScale, FaLock, FaServer, FaUserTag} from "react-icons/fa";
import { LuActivity } from "react-icons/lu";
import { IoIosFlash } from "react-icons/io";
import { TbFavicon, TbFileTypeSvg, TbFileTypeJpg, TbFileTypePng, } from "react-icons/tb";

export default function MenuBar() {
    // const [isClient, setIsClient] = useState(false);

    // useEffect(() => {
    //     setIsClient(true);
    // }, []);
    
    // if (!isClient) return ( <>{`Render nothing on the server`}</> ); // Render nothing on the server

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Delay rendering for a moment to avoid hydration issues
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!isMounted) return ( <>{`Render nothing on the server`}</> ); // Render nothing on the server

    const menuItems = [
        "Profile",
        "Dashboard",
        "Activity",
        "Analytics",
        "System",
        "Deployments",
        "My Settings",
        "Team Settings",
        "Help & Feedback",
        "Log Out",
    ];

    const icons = {
        chevron: <FaChevronDown fill="currentColor" size={16} />,
        scale: <FaBalanceScale className="text-warning" fill="currentColor" size={30} />,
        lock: <FaLock className="text-success" fill="currentColor" size={30} />,
        activity: <LuActivity className="text-secondary" fill="currentColor" size={30} />,
        flash: <IoIosFlash className="text-primary" fill="currentColor" size={30} />,
        server: <FaServer className="text-success" fill="currentColor" size={30} />,
        user: <FaUserTag className="text-danger" fill="currentColor" size={30} />,
        favicon: <TbFavicon className="text-primary" size={30} />,
        svg: <TbFileTypeSvg className="text-secondary" size={30} />,
        jpg: <TbFileTypeJpg className="text-info" size={30} />,
        png: <TbFileTypePng className="text-success" size={30} />,
    };

    return (
        <nav>
            <Navbar disableAnimation isBordered>
                <NavbarContent className="sm:hidden" justify="start">
                    <NavbarMenuToggle />
                </NavbarContent>

                <NavbarContent className="sm:hidden pr-3" justify="center">
                    <NavbarBrand>
                    {/* <AcmeLogo /> */}
                    <p className="font-bold text-inherit">ACME</p>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarBrand>
                    {/* <AcmeLogo /> */}
                    <Link href="/">      
                        <p className="font-bold text-inherit">FAVI</p>
                    </Link>
                    </NavbarBrand>

                    <Dropdown>
                    <NavbarItem>
                        <DropdownTrigger>
                        <Button
                            disableRipple
                            className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                            endContent={icons.chevron}
                            radius="sm"
                            variant="light"
                        >
                            Convertors
                        </Button>
                        </DropdownTrigger>
                    </NavbarItem>

                    <DropdownMenu
                        aria-label="ACME features"
                        className="max-h-[500px] overflow-y-auto" // 5 columns with a fixed width for alignment
                    >
                        <DropdownItem startContent={icons.favicon} textValue="favicon-converter">
                        <Link href="/favicon-converter" passHref color="warning">
                            Favicon Converter
                        </Link>
                        </DropdownItem>

                        <DropdownItem startContent={icons.svg} textValue="PNG to SVG Converter">
                        <Link href="/SVG-to-PNG" passHref color="warning">
                        Convert to SVG 
                        </Link>
                        </DropdownItem>

                        <DropdownItem startContent={icons.jpg} textValue="PNG to JPG Converter">
                        <Link href="/PNG-to-JPG" passHref color="info">
                            Convert to JPG 
                        </Link>
                        </DropdownItem>

                        <DropdownItem startContent={icons.png} textValue="JPG to PNG Converter">
                        <Link href="/JPG-to-PNG" passHref color="info">
                            Convert to PNG
                        </Link>
                        </DropdownItem>
                        
                        <DropdownItem startContent={icons.png} textValue="WebP to PNG Converter">
                        <Link href="/JPG-to-WebP" passHref color="info">
                            Convert to WebP
                        </Link>
                        </DropdownItem>

                        {/* {[...Array(25)].map((_, index) => (
                        <DropdownItem
                            key={`item-${index}`}
                            description={`Description for item ${index + 1}`}
                            startContent={icons.scale} // Example icon, replace as needed
                        >
                            Item {index + 1}
                        </DropdownItem>
                        ))} */}
                    </DropdownMenu>
                    </Dropdown>

                    <NavbarItem isActive>
                    <Link href="#" aria-current="page" color="warning">
                        Generator
                    </Link>
                    </NavbarItem>
                    
                    <Dropdown>
                    <NavbarItem>
                        <DropdownTrigger>
                        <Button
                            disableRipple
                            className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                            endContent={icons.chevron}
                            radius="sm"
                            variant="light"
                        >
                            Tools
                        </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu
                        aria-label="ACME features"
                        className="max-w-[340px] max-h-[500px] overflow-y-auto"
                        itemClasses={{
                        base: "gap-4",
                        }}
                    >
                        <DropdownItem
                        key="autoscaling"
                        description="ACME scales apps to meet user demand, automagically, based on load."
                        startContent={icons.scale}
                        >
                        Autoscaling
                        </DropdownItem>
                        <DropdownItem
                        key="usage_metrics"
                        description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
                        startContent={icons.activity}
                        >
                        Usage Metrics
                        </DropdownItem>
                        <DropdownItem
                        key="production_ready"
                        description="ACME runs on ACME, join us and others serving requests at web scale."
                        startContent={icons.flash}
                        >
                        Production Ready
                        </DropdownItem>
                        <DropdownItem
                        key="99_uptime"
                        description="Applications stay on the grid with high availability and high uptime guarantees."
                        startContent={icons.server}
                        >
                        +99% Uptime
                        </DropdownItem>
                        <DropdownItem
                        key="supreme_support"
                        description="Overcome any challenge with a supporting team ready to respond."
                        startContent={icons.user}
                        >
                        +Supreme Support
                        </DropdownItem>
                    </DropdownMenu>
                    </Dropdown> 

                    <Dropdown>
                    <NavbarItem>
                        <DropdownTrigger>
                        <Button
                            disableRipple
                            className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                            endContent={icons.chevron}
                            radius="sm"
                            variant="light"
                        >
                            APIs
                        </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu
                        aria-label="ACME features"
                        className="w-[340px]"
                        itemClasses={{
                        base: "gap-4",
                        }}
                    >
                        <DropdownItem
                        key="autoscaling"
                        description="ACME scales apps to meet user demand, automagically, based on load."
                        startContent={icons.scale}
                        >
                        Autoscaling
                        </DropdownItem>
                        <DropdownItem
                        key="usage_metrics"
                        description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
                        startContent={icons.activity}
                        >
                        Usage Metrics
                        </DropdownItem>
                        <DropdownItem
                        key="production_ready"
                        description="ACME runs on ACME, join us and others serving requests at web scale."
                        startContent={icons.flash}
                        >
                        Production Ready
                        </DropdownItem>
                        <DropdownItem
                        key="99_uptime"
                        description="Applications stay on the grid with high availability and high uptime guarantees."
                        startContent={icons.server}
                        >
                        +99% Uptime
                        </DropdownItem>
                        <DropdownItem
                        key="supreme_support"
                        description="Overcome any challenge with a supporting team ready to respond."
                        startContent={icons.user}
                        >
                        +Supreme Support
                        </DropdownItem>
                    </DropdownMenu>
                    </Dropdown> 

                </NavbarContent>

                <NavbarContent justify="end">
                    {/* <NavbarItem className="hidden lg:flex">
                    <Link href="#">Login</Link>
                    </NavbarItem>
                    <NavbarItem>
                    <Link href="#">Sign Up</Link>
                    </NavbarItem> */}
                    <NavbarItem>          
                    <ThemeSwitcher />
                    </NavbarItem>
                </NavbarContent>

                <NavbarMenu>
                    {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                        className="w-full"
                        color={
                            index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
                        }
                        href="#"
                        >
                        {item}
                        </Link>
                    </NavbarMenuItem>
                    ))}
                </NavbarMenu>
                </Navbar>
        </nav>
    );
}