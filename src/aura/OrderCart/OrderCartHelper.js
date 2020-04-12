({
    setTabeColumns : function(cmp){
        let actions = [{ label: 'Delete', name: 'delete' }];
        cmp.set('v.columns', [
            {label: 'Product name', fieldName: 'Name',     type: 'text',   editable: false},
            {label: 'Quantity',     fieldName: 'Quantity', type: 'number', editable: true},
            {label: 'Price',        fieldName: 'Price__c', type: 'currency', typeAttributes: { currencyCode: 'USD', maximumSignificantDigits: 5}, editable: false},
            {type:  'action', typeAttributes: { rowActions: actions } }
        ]);
    },
    createListProducts : function(cmp, helper, listProducts) {
        try {
            //count how many times the product is added to the basket
            let countEachProduct = listProducts.reduce(function(acc, el) {
                acc[el.Id] = (acc[el.Id] || 0) + 1;
                return acc;
            }, {});

            //add items and add quantity to array, edit price
            let listUniqueProduct=[];
            let currentProductsCart = cmp.get('v.listItems');
            for(let key in countEachProduct){
                //compare countEachProduct and listProducts and change the quantity
                let product = listProducts.find(function(row) {
                    if(row.Id === key){
                        if(currentProductsCart && currentProductsCart !== undefined){
                            let item = currentProductsCart.find(function(rowItem) {
                                if(row.Id === rowItem.Id){
                                    return true;
                                }
                            });
                            
                            if(item && item !== undefined && item.Quantity !== countEachProduct[key]){
                                row['Quantity'] = Number(item.Quantity)+1;
                                row['Price__c'] = (Number(item.Quantity)+1)*row.Price__c;                                
                            } else { // else take total quantity
                                row['Quantity'] = countEachProduct[key];
                                row['Price__c'] = countEachProduct[key]*row.Price__c;
                            }

                        } else {
                            row['Quantity'] = countEachProduct[key];
                            row['Price__c'] = countEachProduct[key]*row.Price__c;
                        }
                        return true;
                    }
                });
                listUniqueProduct.push(product);
            }
            cmp.set('v.listItems',listUniqueProduct);
            helper.setTotalPrice(cmp, cmp.get('v.listItems'));            
        } catch (error) {
            console.log('Error createListProducts : ', error);
                    
        }
    },

    setTotalPrice : function(cmp, listData){
        let totalPrice = 0;
        listData.forEach(function(item){
            totalPrice += item.Price__c;
        });
        cmp.set('v.totalPrice', totalPrice);
    },

    removeProduct : function(cmp, event, row){
        let listProducts = cmp.get('v.listItems');
        let index = listProducts.indexOf(row);                    
        if (index > -1) {
            listProducts.splice(index, 1);
        }
        cmp.set('v.listItems',listProducts)          
    },

    onSave : function(cmp,helper, draftValues) {
        try {
            let tableData = cmp.get('v.listItems');
           
            for(let i = 0; i < draftValues.length; i++) {
                let id = draftValues[i]['Id'];
                let row = tableData.find((row) => {
                    return row.Id === id;
                });

                for(let field in draftValues[i]) {
                    row[field] = draftValues[i][field];
                }
                row.Price__c =  row.Price__c*row.Quantity;
            }
            cmp.set('v.draftValues', []);
            cmp.set('v.listItems', tableData); 
            helper.setTotalPrice(cmp, tableData);
        } catch (error) {
            console.log('Error onSave : ' + error);
                            
        }

    },
    
    onCheckout :  function(cmp, event, helper) {
        try {
            let action = cmp.get('c.createOrder');
            let listItems = cmp.get('v.listItems');
            let listProductsJSON = [];
            for(let i = 0; i < listItems.length; i++){
                let item = {
                    productId : listItems[i].Id,
                    quantity : listItems[i].Quantity,
                    price : listItems[i].Price__c
                }
                listProductsJSON.push(item);
            }
            console.log('listProductsJSON = ' + JSON.stringify(listProductsJSON));
        
            action.setParams({
                'listProductsJSON' : JSON.stringify(listProductsJSON),
                'idAccount' : cmp.get('v.accountId')
            });

            action.setCallback(this, function(response){
                let state = response.getState();
                if(state === 'SUCCESS'){
                    cmp.find('notifLib').showToast({
                        'title': 'Success',
                        'message': 'Order successfully created'
                    });
                    cmp.set('v.listItems',{});
                    cmp.set('v.isOpen',false);
                } else if (state === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            });
            $A.enqueueAction(action);   
        } catch (error) {
            console.log('Error onCheckout : ' + error);
        }
   }
})