/**
 * ScriptMate — Google Apps Script Backend
 * =========================================
 * FREE backend using Google Sheets as database.
 * Orders from ANY device show in admin panel.
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SETUP (5 minutes):
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 1. Go to https://script.google.com
 * 2. Click "New project"
 * 3. Delete everything → paste this entire file
 * 4. Click 💾 Save
 * 5. Click Deploy → New deployment
 * 6. Gear ⚙ next to Type → select "Web app"
 * 7. Execute as: Me
 * 8. Who has access: Anyone
 * 9. Click Deploy → COPY the URL
 * 10. Paste URL in main.js line 13 AND admin.js line 13
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const SHEET_NAME = 'Orders';

function getSheet() {
  const files = DriveApp.getFilesByName('ScriptMate_Orders');
  let ss;
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    ss = SpreadsheetApp.create('ScriptMate_Orders');
  }
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'id','created_at','full_name','phone','email',
      'college','roll_number','level','year','semester',
      'work_type','subject','pages','has_graphs','instructions',
      'file_name','base_cost','graph_charge','grand_total'
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function addCors(output) {
  return output
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/* GET — fetch orders OR save order via query params */
function doGet(e) {
  const action = (e.parameter.action || 'getOrders');

  // Save order via GET (workaround for no-cors POST limitation)
  if (action === 'saveOrder') {
    try {
      const sheet = getSheet();
      const p = e.parameter;
      sheet.appendRow([
        p.id || '',
        p.created_at || new Date().toISOString(),
        p.full_name || '',
        p.phone || '',
        p.email || '',
        p.college || '',
        p.roll_number || '',
        p.level || '',
        Number(p.year) || 0,
        Number(p.semester) || 0,
        p.work_type || '',
        p.subject || '',
        Number(p.pages) || 0,
        p.has_graphs === 'true' || p.has_graphs === '1',
        p.instructions || '',
        p.file_name || '',
        Number(p.base_cost) || 0,
        Number(p.graph_charge) || 0,
        Number(p.grand_total) || 0
      ]);
      return addCors(ContentService
        .createTextOutput(JSON.stringify({ success: true, id: p.id }))
        .setMimeType(ContentService.MimeType.JSON));
    } catch(err) {
      return addCors(ContentService
        .createTextOutput(JSON.stringify({ error: err.message }))
        .setMimeType(ContentService.MimeType.JSON));
    }
  }

  // Get all orders
  if (action === 'getOrders') {
    try {
      const sheet = getSheet();
      const rows = sheet.getDataRange().getValues();
      if (rows.length <= 1) {
        return addCors(ContentService
          .createTextOutput(JSON.stringify({ orders: [] }))
          .setMimeType(ContentService.MimeType.JSON));
      }
      const headers = rows[0];
      const orders = rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = row[i]; });
        obj.has_graphs = obj.has_graphs === true || obj.has_graphs === 'TRUE' || obj.has_graphs === 'true';
        ['year','semester','pages','base_cost','graph_charge','grand_total'].forEach(k => {
          obj[k] = Number(obj[k]) || 0;
        });
        return obj;
      }).filter(o => o.id);
      orders.reverse();
      return addCors(ContentService
        .createTextOutput(JSON.stringify({ orders }))
        .setMimeType(ContentService.MimeType.JSON));
    } catch(err) {
      return addCors(ContentService
        .createTextOutput(JSON.stringify({ error: err.message, orders: [] }))
        .setMimeType(ContentService.MimeType.JSON));
    }
  }

  // Delete order
  if (action === 'deleteOrder') {
    try {
      const id = e.parameter.id;
      const sheet = getSheet();
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(id)) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      return addCors(ContentService
        .createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON));
    } catch(err) {
      return addCors(ContentService
        .createTextOutput(JSON.stringify({ error: err.message }))
        .setMimeType(ContentService.MimeType.JSON));
    }
  }

  return addCors(ContentService
    .createTextOutput(JSON.stringify({ error: 'Unknown action' }))
    .setMimeType(ContentService.MimeType.JSON));
}

/* POST fallback (in case browser supports it) */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = getSheet();
    sheet.appendRow([
      payload.id || '',
      payload.created_at || new Date().toISOString(),
      payload.full_name || '',
      payload.phone || '',
      payload.email || '',
      payload.college || '',
      payload.roll_number || '',
      payload.level || '',
      payload.year || 0,
      payload.semester || 0,
      payload.work_type || '',
      payload.subject || '',
      payload.pages || 0,
      payload.has_graphs ? true : false,
      payload.instructions || '',
      payload.file_name || '',
      payload.base_cost || 0,
      payload.graph_charge || 0,
      payload.grand_total || 0
    ]);
    return addCors(ContentService
      .createTextOutput(JSON.stringify({ success: true, id: payload.id }))
      .setMimeType(ContentService.MimeType.JSON));
  } catch(err) {
    return addCors(ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON));
  }
}
