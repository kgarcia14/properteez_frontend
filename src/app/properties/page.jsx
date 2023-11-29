'use client'

const getProperties = async (e) => {
  const results = await fetch('http://127.0.0.1:3333/properties/8');

  console.log(results);
  return results;
}

const Properties = () => {
  return ( 
    <main>
      <button onClick={getProperties}>Properties Page</button>
    </main>
   );
}
 
export default Properties;
