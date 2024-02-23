export const dd = (title, ...additionalDetails) => {
    if (!title) title = "Custom Log";

    console.log(`---------- ${title} ----------`);
    console.info(...additionalDetails);
    console.log(`========== ${title}==========`);

}// customLogger
