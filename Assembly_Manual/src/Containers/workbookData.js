import axios from 'axios'

const SPREADSHEET_ID = '11ayVTVvDEbOezJJSL6N2_ct-rm7NgKWlpBPqqtvVh5U'
const API_KEY = 'AIzaSyCqcO7MQv4dsj76ps3nNJnMwTT8Cvqv-eM'
const WORKBOOK_BASE_URL =
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values`

function buildWorkbookUrl(sheetName) {
    return `${WORKBOOK_BASE_URL}/${encodeURIComponent(sheetName)}?key=${API_KEY}`
}

function pushStepGroup(groups, currentGroup) {
    if (currentGroup.length > 0) {
        groups.push(currentGroup)
    }
}

export function groupWorkbookRows(rows) {
    const groups = []
    let currentGroup = []

    rows.slice(2).forEach((row) => {
        if (row?.[1]) {
            pushStepGroup(groups, currentGroup)
            currentGroup = [row]
            return
        }

        if (currentGroup.length > 0) {
            currentGroup.push(row)
        }
    })

    pushStepGroup(groups, currentGroup)
    return groups
}

export async function fetchWorkbookSteps(sheetName) {
    const response = await axios.get(buildWorkbookUrl(sheetName))
    return groupWorkbookRows(response.data.values || [])
}
