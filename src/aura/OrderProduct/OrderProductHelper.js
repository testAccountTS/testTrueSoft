({
    onCart : function(cmp, event, helper) {
        let listProducts = cmp.get('v.productsCart');
        let product = cmp.get('v.product');
        product['Quantity'] = 0;
        listProducts.push(product);
        cmp.set('v.productsCart',listProducts);
        let appEvent = $A.get("e.c:OrderCartEvent");

        appEvent.setParams({
            "listProducts" : cmp.get('v.productsCart')
        });

        appEvent.fire(); 

        cmp.find('notifLib').showToast({
            'title': 'Success',
            'message': 'Item successfully added to cart'
        });     
    }
})