# React Menus

Simple menu system for React

## How it works

The menu system is composed of three elements:
`<Menu />`, `<Menu.Option />`, and `<Menu.Separator />`

* The `Menu` component contains all of the other menu elements.
* The `Menu.Option` component is a menu element within the menu system.  It can have as many child `Menu.Option` components as you'd like, including options within options as deep as you want.
* The `Menu.Separator` is a simple menu separator line to separate elements within a menu options group

## Properties

### Menu Component

animated:  Animates menu items as the mouse moves between them

### Menu.Option component

title {string | component}:  The text to show for this menu item.  Can be text or a react component, including images
onClick {function}:  Event handler for the onClick event
toggles {boolean}: Makes this menu item toggleable
toggledOn {boolean}: Sets the starting toggle state for this element
onToggle {function}: Fires when the toggle state changes for this menu item

### Menu.Separator component

No properties can be passed to this component since it's just a simple separator line

## Example Useage:

```jsx
import Menu from "./";

export default function MenuSystem() {
    return(
        <Menu animate={true}>

            <Menu.Option
            title="File"
            >
                <Menu.Option title="New" />
                <Menu.Option title="New from Template" />
                <Menu.Separator />
                <Menu.Option title="Save" />
                <Menu.Option title="Save as..." />
                <Menu.Option title="New" />
                

            </Menu.Option>

            <Menu.Option title="Edit" >
                
                <Menu.Option
                title="Some Edit here"
                onClick={()=>{console.log("Clicked the 'some edit here' menu element or something.")}}
                />

                <Menu.Option
                title="A Menu with Sub-menus"
                >
                    <Menu.Option title={"Submenu 1"} />
                    <Menu.Option title={"Submenu 2"} />
                </Menu.Option>
                
                <Menu.Separator />
                <Menu.Option
                title={"A toggleable item"}
                toggles={true}
                toggledOn={false}
                onToggle={toggled=>{ console.log("This element was just toggled!  Its status is: ", toggled); } }
                >
                </Menu.Option>
            </Menu.Option>

            <Menu.Option
            title="Options"
            >
                <Menu.Option title={<div style={{fontSize: '1.5em', color: 'yellow'}}>A formatted text item</div>} />
                <Menu.Option title="New from Template" />
                <Menu.Separator />
                <Menu.Option title="Save" />
                <Menu.Option title="Save as..." />
                <Menu.Option title="New" />
                

            </Menu.Option>

        </Menu>
    )
}
```
