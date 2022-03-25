/*
    Menu.jsx

    A full menu system for React, created by Devin Crowley

*/

import React, { useState, useEffect } from 'react';
import style from './Menu.Module.css';

/**
 * 
 * @param {*} props 
 */
export default function Menu(props) {

    const state = {
        /** The last main menu element that was hovered over */
        lastHoveredElement: null,
        /** A function for collapsing the last main menu element that was hovered over */
        collapseLast: null,
        /** Lets menu items know that the mouse is currently inside the menu system */
        mouseIsInsideMenus: false,
        /** Animates the menus if the props.animate === true */
        animate: props.animate
    };

    [state.isMenuActive, state.setIsMenuActive] = useState(false);
    [state.lastFocusedElement, state.setLastFocusedElement] = useState(false);

    // Pass the isMenuActive variables to children by cloning them with props
    // and also set first-level menu items as main menus
    const childElements = props.children.map((child, index)=>{
        return React.cloneElement(child, {key: index, isMainMenu: true, className: `${style.main} ${style.menuitem}`, state: state})
    })

    const handleMouseDown = (evt)=>{outsideClickHandler(evt, state)}
    const handleMouseMove = (evt)=>{outsideMoveHandler(evt, state)}

    useEffect(()=>{

        if(!state.isMenuActive) {
            state.lastHoveredElement = null;
            state.collapseLast = null;
        }

        // Handle clicks and movements outside of the menu system
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
        
        // Prevent multiple instances of the event listener
        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mousemove", handleMouseMove);
        }
    })

    return (
        <div 
        className={style.menu}
        tabIndex={0}
        onMouseDown={()=>{
            if(!state.isMenuActive) state.setIsMenuActive(true);
        }}
        ref={elem=>{ state.domElement = elem; }}
        >
            {childElements || "No Menus Defined."}
        </div>
    )
}

/**
 * A single sub-menu element
 * @param {*} props 
 * @returns 
 */
function MenuOption(props) {
    const state = props.state;
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isToggled, setIsToggled] = useState(true);

    /** Parent information to pass to the child that's set *after* rendering */
    const parent = {};

    useEffect(()=>{

        // If the entire menu system is set to inactive, collapse this menu
        if(!props.state.isMenuActive && !isCollapsed) {
            setIsCollapsed(true);
        }

    }, [props.state.isMenuActive, isCollapsed]);


    // If children exist, pass variables and styles to children by cloning them with props
    let childElements = null;
        if(props.children) {
        if(Array.isArray(props.children)) {
            childElements = props.children.map((child, index)=>{
                return React.cloneElement(child, {key: index, isMainMenu: false, className: `${style.menuitem}`, state: state, parent: parent})
            })
        } else {
            childElements = React.cloneElement(props.children, {key: 1, isMainMenu: false, className: `${style.menuitem}`, state: state, parent: parent})
        }
    }

    // Event handler for when the mouse enters the menu item
    const handleMouseEnter = (elem)=>{
            
        // We just entered this menu system, but another menu element was already open
        // so let's collapse the previous menu while this one is shown, but ONLY IF the
        // previous menu was not a part of this newly opened menu
        if(state.lastHoveredElement && !state.lastHoveredElement.contains(elem.target)) {
            if(state.collapseLast) state.collapseLast(true);
            state.collapseLast = null;
        }

        // Tells the menu system that this was the last element the mouse was hovering over
        state.lastHoveredElement = elem.currentTarget;

        // Moving the mouse over an expandable menu element will always expand it, but only
        // if it's not a main menu element
        if(!props.isMainMenu) {
            setIsCollapsed(false);
        }

        // Let's the menu know this was the last main menu element that was hovered over
        if(props.isMainMenu && state && state.isMenuActive) {
            elem.currentTarget.classList.remove(style.collapsed);

            // Collapse the last active menu element so only this element is shown
            if(state.lastFocusedElement) state.lastFocusedElement.classList.add(style.collapsed);
            
            // Collapse the last expanded menu element, if applicable
            if(state.collapseLast) state.collapseLast(true);

            state.lastFocusedElement = elem.currentTarget;

            // Set this menu item as the last collapsable menu
            state.collapseLast = setIsCollapsed;

            if(state && state.isMenuActive) setIsCollapsed(false);
        }
    }

    // Event handler for menu click events
    const handleOnClick = (event)=>{

        // If this menu was passed an onClick event, fire it here
        if(props.onClick) props.onClick(event);
    
        // If this is a toggleable menu element, change its toggle state
        if(props.toggles) {
            if(props.onToggle) {
                props.onToggle(!isToggled);
                setIsToggled(!isToggled);
            }
        }

        // Toggle the collapse state of this menu
        setIsCollapsed(!isCollapsed);
    
        // Let the menu system know that this is the actively open element for collapsing
        state.collapseLast = setIsCollapsed;
    
        // Let the menu system know this is the last menu DOM node to be clicked/hovered
        state.lastHoveredElement = event.currentTarget;

        if(!props.isMainMenu) {
            state.setIsMenuActive(false);
        }

    }

    /* --------- RENDER ---------  */

    return (
        <div
        tabIndex={1}
        className={`${props.className}`}
        onClick={handleOnClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={()=>{ state.collapseLast = setIsCollapsed; }}
        >
            {/* If this menu item is toggleable, show a checkmark when toggled on */}
            {props.toggles && isToggled ? <span className={style.toggled}></span> : null}
            {props.title}
            {/* If this menu item has children, show the expander icon to the right */}
            {childElements && !props.isMainMenu ? <span className={style.arrow_right}></span> : null}

            {childElements ? 
                <div 
                className={ concatStyles(style, isCollapsed ? "collapsed" : "", state.animate ? "animate" : "", "group") }
                >
                    {childElements}
                </div>
            : null }
        </div>
    )
}


/**
 * A simple separator line between menu elements
 * @returns {object} Component
 */
function MenuSeparator() {
    return (
        <div className={style.separator}></div>
    )
}


// Small pure function for concatenating styles from stylem odules
function concatStyles(styles) {
    let concatStyles = "";

    // First argument is always the style definitions so remove it
    const args = [...arguments];
    args.splice(0,1);

    args.forEach(style=>{
        if(!styles[style] || !style) return;
        concatStyles += styles[style] + ' ';
    });

    concatStyles = concatStyles.trim();

    return concatStyles;
}


/* ----------------- */
/*  EVENT HANDLERS   */
/* ----------------- */

/**
 * Checks for clicks outside of the menu system so it knows to collapse itself
 * @param {event} evt 
 * @param {menuState} state 
 */
 function outsideClickHandler(evt, state) {
    if(state.domElement && state.domElement.contains(evt.target) === false) {
        state.setIsMenuActive(false);
    }
}

/**
 * Auto-collapse a menu item whenever it moves over ANOTHER menu item but not the body
 * @param {event} evt 
 * @param {menuState} state 
 */
function outsideMoveHandler(evt, state) {
    
    if(!(state && state.domElement)) return;
    
    // Is the mouse moving inside the menu system?  If so, let the menu system know.
    const mouseIsInsideMenus = state.domElement.contains(evt.target);

    let mouseIsInsideCurrentElement;
    state.mouseIsInsideMenus = mouseIsInsideMenus;
    
    // Make sure the mouse isn't just moving between child menu elements of this menu
    if(state.lastHoveredElement) {
        mouseIsInsideCurrentElement = state.lastHoveredElement.contains(evt.target);
    }
    
    // The mouse moved outside this menu item and into a different menu item, so close it
    if(mouseIsInsideMenus && !mouseIsInsideCurrentElement) {
        if(state.collapseLast) {
            state.collapseLast(true);
            state.collapseLast = null;
        }
    }

}

// Final Exports attached to the Menu component function

Menu.Option = MenuOption;
Menu.Separator = MenuSeparator;