import axios from 'axios'

const SPREADSHEET_ID = '11ayVTVvDEbOezJJSL6N2_ct-rm7NgKWlpBPqqtvVh5U'
const API_KEY = 'AIzaSyCqcO7MQv4dsj76ps3nNJnMwTT8Cvqv-eM'
const SHEET_BASE_URL =
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values`
const BOM_URL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWud7yHH3g1cAPJvzxsQePnKx0l3GJQWH_PJjGYbjaZ-zfcvUxY3e5tKrE_zElcfdFqLYGLTySNaAl/pub?output=csv'

function buildSheetUrl(sheetName) {
    return `${SHEET_BASE_URL}/${encodeURIComponent(sheetName)}?key=${API_KEY}`
}

export function getLaserSheetName(language) {
    return language === 'DE' ? 'Laser-DE' : 'Laser'
}

function pushSection(sections, currentSection) {
    if (currentSection.length > 0) {
        sections.push(currentSection)
    }
}

export function groupLaserRows(rows) {
    const sections = []
    let currentSection = []

    rows.slice(1).forEach((row) => {
        if (row?.[0]) {
            pushSection(sections, currentSection)
            currentSection = [row]
            return
        }

        if (currentSection.length > 0) {
            currentSection.push(row)
        }
    })

    pushSection(sections, currentSection)
    return sections
}

export async function fetchLaserSections(language) {
    const response = await axios.get(buildSheetUrl(getLaserSheetName(language)))
    return groupLaserRows(response.data.values || [])
}

export function getLaserTitles(sections) {
    return sections.map((section) => section[0]?.[0]).filter(Boolean)
}

export function getFirstLaserPath(sections) {
    return getLaserTitles(sections)[0] ?? ''
}

export function getLaserSectionByPath(sections, path) {
    return sections.find((section) => section[0]?.[0] === path) ?? []
}

function parseCsvField(match) {
    if (match.startsWith('"')) {
        return match.slice(1, -1).replace(/""/g, '"')
    }

    return match
}

function parseCsvRow(rowText) {
    const matches = rowText.match(/"((?:[^"])*)"|([^",\n]+)/g) || []
    return matches.map(parseCsvField)
}

function mapCsvRowToRecord(headers, fields) {
    return headers.reduce((record, header, index) => {
        record[header] = fields[index]
        return record
    }, {})
}

export function parseBomCsv(csvText) {
    const [headerRow = '', ...rows] = csvText.split(/\r?\n/)
    const headers = parseCsvRow(headerRow)
    const data = rows
        .filter(Boolean)
        .map((row) => mapCsvRowToRecord(headers, parseCsvRow(row)))

    return { headers, data }
}

export async function fetchBomData() {
    const response = await axios.get(BOM_URL)
    return parseBomCsv(response.data)
}
