const MONTHS = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
];

export function formatDate(year: number, month: number | null, day: number | null) {
    if (month == null) return `${year}`;
    const monthName = MONTHS[month - 1];
    if (day == null) return `${monthName} ${year}`;
    return `${monthName} ${day}, ${year}`;
}

export function toDMS(value: number, posDir: string, negDir: string) {
    const dir = value >= 0 ? posDir : negDir;
    const abs = Math.abs(value);
    const deg = Math.floor(abs);
    const minFloat = (abs - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = ((minFloat - min) * 60).toFixed(1);
    return `${deg}°${min}'${sec}"${dir}`;
}
