// import { createClient } from "@corsair-dev/app";

// const corsair = createClient({
//   apiKey: "ch_JK62W9s5ctIoMtcFEPhUbICkbc_6zR27GbZ6KXhBIFg",
// });

// async function main() {
//   const instances = await corsair.instances.list();

//   console.dir(instances, { depth: null });
// }

// main();





import { createClient } from "@corsair-dev/app";

const corsair = createClient({
  apiKey: "ch_JK62W9s5ctIoMtcFEPhUbICkbc_6zR27GbZ6KXhBIFg",
});

const tenants = await corsair
  .instance("ef203b14eb6a49a68d9d8d9335d33655")
  .tenants.list();

console.dir(tenants, { depth: null });

const inst = corsair.instance(
  "ef203b14eb6a49a68d9d8d9335d33655"
);

console.log(
  await inst.plugins.list()
);