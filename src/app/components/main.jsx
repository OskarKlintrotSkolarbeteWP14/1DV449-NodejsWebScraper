import React from 'react';

const Main = () => {
  jQuery.getJSON( "http://api.sr.se/api/v2/traffic/messages?format=json&pagination=false",
  (data)=> {
    console.log(data);
  } );

  return(
    <div>
      <h1>
        Mr Mashup
      </h1>
      <p>
        It's alive!
      </p>
    </div>
  );
};

export default Main;
