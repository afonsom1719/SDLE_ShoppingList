import React, { useState, useEffect, CSSProperties } from 'react';
import { getShoppingLists } from '../../API';
import { Button } from '@material-ui/core';

interface ShoppingListSelectorProps {
  customStyle: CSSProperties;
}

const ShoppingListSelector = ({ customStyle } : ShoppingListSelectorProps) => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');

  useEffect(() => {
    // Fetch shopping lists when the component mounts
    console.log('fetching shopping lists: ', selectedList);
    fetchShoppingLists();
  }, []);

  const fetchShoppingLists = async () => {
    try {
      getShoppingLists().then((res: any) => {
        console.log('shopping lists: ', res.data.ShoppingLists);
        setShoppingLists(res.data.ShoppingLists);
      }
      );
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
    }
  };


    const handleSelectShoppingList = (shoppingListId: string) => {
        setSelectedList(shoppingListId);
        console.log('selected shopping list: ', shoppingListId);
    };

    return (
        <div style={customStyle}>
            <h2>Select a shopping list</h2>
            <ul>
                {shoppingLists.map((shoppingList: any) => (
                    <li key={shoppingList}>
                        <Button variant='contained' onClick={() => handleSelectShoppingList(shoppingList)}>
                            {shoppingList}
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );

};

export default ShoppingListSelector;
