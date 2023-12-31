import React, { CSSProperties } from 'react';
// import { getShoppingLists } from '../../API';
import { Button } from '@material-ui/core';
import AddShoppingList from './AddShoppingList';
import { DotContext, Ormap } from '../../crdts';
import TrashButton from '../TrashButton/TrashButton';

interface ShoppingListSelectorProps {
  customStyle: CSSProperties;
  shoppingLists: Ormap[];
  currentShoppingList: Ormap;
  onShoppingListSelected: (shoppingListId: string) => void;
  onAddShoppingList: (e: React.FormEvent, formData: ShoppingListEntry<string, DotContext>) => void;
  onDeleteShoppingList: (shoppingListId: string) => void;
}

const ShoppingListSelector = ({
  customStyle,
  shoppingLists,
  currentShoppingList,
  onShoppingListSelected,
  onAddShoppingList,
  onDeleteShoppingList,
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

  const handleDeleteShoppingList = (shoppingListId: string) => {
    onDeleteShoppingList(shoppingListId);
  }

  return (
    <div style={customStyle}>
      <h1>Select a shopping list</h1>
      <ul className='customList'>
        {shoppingLists.map((shoppingList: Ormap) => (
          <li key={shoppingList.id}>
            <Button
              variant='contained'
              style={currentShoppingList.id !== shoppingList.id ? { borderRadius: '10px' } : {borderRadius: '10px', backgroundColor: '#ff9900', color: 'white'}}
              onClick={() => handleSelectShoppingList(shoppingList.id)}
            >
              {shoppingList.id}
            </Button>
            <TrashButton onClick={() => handleDeleteShoppingList(shoppingList.id)} />
          </li>
        ))}
      </ul>
      <AddShoppingList saveShoppingList={onAddShoppingList} />
    </div>
  );
};

export default ShoppingListSelector;
