import React, { CSSProperties } from 'react';
// import { getShoppingLists } from '../../API';
import { Button } from '@material-ui/core';
import AddShoppingList from './AddShoppingList';
import { DotContext } from '../../crdts';

interface ShoppingListSelectorProps {
  customStyle: CSSProperties;
  shoppingLists: string[];
  onShoppingListSelected: (shoppingListId: string) => void;
  onAddShoppingList: (e: React.FormEvent, formData: ShoppingListEntry<string, DotContext>) => void;
}

const ShoppingListSelector = ({
  customStyle,
  shoppingLists,
  onShoppingListSelected,
  onAddShoppingList,
}: ShoppingListSelectorProps) => {

  // useEffect(() => {
  //   // Fetch shopping lists when the component mounts
  //   console.log('fetching shopping lists: ', selectedList);
  //   fetchShoppingLists();
  // }, []);

  // const fetchShoppingLists = async () => {
  //   try {
  //     getShoppingLists().then((res: any) => {
  //       console.log('shopping lists: ', res.data.ShoppingLists);
  //       setShoppingLists(res.data.ShoppingLists);
  //     });
  //   } catch (error) {
  //     console.error('Error fetching shopping lists:', error);
  //   }
  // };

  const handleSelectShoppingList = (shoppingListId: string) => {
    onShoppingListSelected(shoppingListId);
    console.log('selected shopping list: ', shoppingListId);
  };

  return (
    <div style={customStyle}>
      <h1>Select a shopping list</h1>
      <ul className='customList'>
        {shoppingLists.map((shoppingList: any) => (
          <li key={shoppingList}>
            <Button
              variant='contained'
              style={{ borderRadius: '10px' }}
              onClick={() => handleSelectShoppingList(shoppingList)}
            >
              {shoppingList}
            </Button>
          </li>
        ))}
      </ul>
      <AddShoppingList saveShoppingList={onAddShoppingList} />
    </div>
  );
};

export default ShoppingListSelector;
