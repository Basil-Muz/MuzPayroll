export const getCurrentFinYear = () => {
    const year = new Date().getFullYear();
    return `${year}-${year+1}`;
};

export const getFinYearOptions = (currentFinYear) => {
    const [year] = currentFinYear.split("-").map(Number);
    const options =[];
    for(let i=3;i>0;i--){
        const y=year-i;
        options.push({
            value:`${y}-${y+1}`,label:`${y}-${y+1}`
        });
    }
    options.push({
        value:currentFinYear,label:currentFinYear
    });
    options.push({
        value:`${year+1}-${year+2}`,label:`${year+1}-${year+2}`
    });
    return options;

};