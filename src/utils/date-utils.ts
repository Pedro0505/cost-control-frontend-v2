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
    { v: "1", n: "Janeiro" }, { v: "2", n: "Fevereiro" }, { v: "3", n: "Março" },
    { v: "4", n: "Abril" }, { v: "5", n: "Maio" }, { v: "6", n: "Junho" },
    { v: "7", n: "Julho" }, { v: "8", n: "Agosto" }, { v: "9", n: "Setembro" },
    { v: "10", n: "Outubro" }, { v: "11", n: "Novembro" }, { v: "12", n: "Dezembro" }
];
