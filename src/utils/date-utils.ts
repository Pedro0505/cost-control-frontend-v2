export const getAllMonthsInPortuguese = Array.from({ length: 12 }, (_, i) => {
    const monthName = new Date(0, i).toLocaleString("pt-BR", { month: "long" });
    const monthNameFirsLetter = monthName.charAt(0);
    const monthNameFirsLetterCap = monthNameFirsLetter.toUpperCase();
    const remainingLetters = monthName.slice(1);
    const capitalizedMonthName = monthNameFirsLetterCap + remainingLetters;

    return {
        value: i + 1,
        label: capitalizedMonthName,
    }
});


export const formatDateString = (dateString: string): string => {
    if (!dateString) return "";
    return dateString.split('-').reverse().join('-').replaceAll('-', '/');
};

export const allMonths = [
    { month_value: "1", month_name: "Janeiro" }, { month_value: "2", month_name: "Fevereiro" }, { month_value: "3", month_name: "Março" },
    { month_value: "4", month_name: "Abril" }, { month_value: "5", month_name: "Maio" }, { month_value: "6", month_name: "Junho" },
    { month_value: "7", month_name: "Julho" }, { month_value: "8", month_name: "Agosto" }, { month_value: "9", month_name: "Setembro" },
    { month_value: "10", month_name: "Outubro" }, { month_value: "11", month_name: "Novembro" }, { month_value: "12", month_name: "Dezembro" }
];
