actions.buttons = {
  
  controller: (params) => {

     const buttonTitles = params.content.split('|');

     params.update.message.quick_replies = [];

     for (let buttonTitle of buttonTitles) {
       params.update.message.quick_replies.push({
         content_type: 'text',
         title: buttonTitle,
         payload: buttonTitle,
       });
     }
     return '';
  }
}

botmaster.use('outgoing', fulfillOutgoingWare({
  actions
}));
