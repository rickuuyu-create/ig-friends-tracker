import { User } from 'firebase/auth';

const SPREADSHEET_NAME = 'IG Friends Database';

export interface FriendRecord {
  id: string;
  username: string;
  name: string;
  occasion: string;
  date: string;
  location: string;
  tags: string;
  notes: string;
  photoUrl: string;
  reminderDate?: string;
  // Stable identity: the Instagram username can change, but the numeric ID never does.
  instagramUserId?: string;
  originalUsername?: string;
  usernameHistory?: string; // comma-separated, oldest first
  lastCheckedAt?: string;
}

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const findOrCreateSpreadsheet = async (token: string): Promise<string> => {
  // 1. Search for existing spreadsheet
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name='${SPREADSHEET_NAME}' and trashed=false`,
    { headers: getHeaders(token) }
  );
  
  if (!searchRes.ok) {
    const body = await searchRes.text().catch(() => '');
    throw new Error(`Failed to search Drive (${searchRes.status}): ${body.slice(0, 300)}`);
  }
  
  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }
  
  // 2. Create if not found
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({
      properties: { title: SPREADSHEET_NAME },
      sheets: [{ properties: { title: 'Friends' } }],
    }),
  });
  
  if (!createRes.ok) {
    const body = await createRes.text().catch(() => '');
    throw new Error(`Failed to create spreadsheet (${createRes.status}): ${body.slice(0, 300)}`);
  }
  
  const createData = await createRes.json();
  const spreadsheetId = createData.spreadsheetId;
  
  // 3. Write headers
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Friends!A1:N1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({
        values: [['ID', 'Username', 'Name', 'Occasion', 'Date', 'Location', 'Tags', 'Notes', 'Photo URL', 'Reminder Date', 'Instagram User ID', 'Original Username', 'Username History', 'Last Checked At']],
      }),
    }
  );
  
  return spreadsheetId;
};

export const fetchFriends = async (token: string, spreadsheetId: string): Promise<FriendRecord[]> => {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Friends!A2:N1000`,
    { headers: getHeaders(token) }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch friends data');
  }

  const data = await res.json();
  if (!data.values) return [];

  return data.values.map((row: string[]) => ({
    id: row[0] || '',
    username: row[1] || '',
    name: row[2] || '',
    occasion: row[3] || '',
    date: row[4] || '',
    location: row[5] || '',
    tags: row[6] || '',
    notes: row[7] || '',
    photoUrl: row[8] || '',
    reminderDate: row[9] || '',
    instagramUserId: row[10] || '',
    originalUsername: row[11] || '',
    usernameHistory: row[12] || '',
    lastCheckedAt: row[13] || '',
  }));
};

export const addFriend = async (
  token: string,
  spreadsheetId: string,
  friend: FriendRecord
): Promise<void> => {
  const values = [[
    friend.id,
    friend.username,
    friend.name,
    friend.occasion,
    friend.date,
    friend.location,
    friend.tags,
    friend.notes,
    friend.photoUrl,
    friend.reminderDate || '',
    friend.instagramUserId || '',
    friend.originalUsername || '',
    friend.usernameHistory || '',
    friend.lastCheckedAt || '',
  ]];

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Friends!A1:N1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ values }),
    }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Failed to append friend (${res.status}): ${body.slice(0, 300)}`);
  }
};

export const updateFriend = async (
  token: string,
  spreadsheetId: string,
  friend: FriendRecord,
  allFriends: FriendRecord[]
): Promise<void> => {
  // Find row index (1-based, +1 for header, so index in array + 2)
  const index = allFriends.findIndex(f => f.id === friend.id);
  if (index === -1) throw new Error('Friend not found');
  
  const rowIndex = index + 2;
  const values = [[
    friend.id,
    friend.username,
    friend.name,
    friend.occasion,
    friend.date,
    friend.location,
    friend.tags,
    friend.notes,
    friend.photoUrl,
    friend.reminderDate || '',
    friend.instagramUserId || '',
    friend.originalUsername || '',
    friend.usernameHistory || '',
    friend.lastCheckedAt || '',
  ]];

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Friends!A${rowIndex}:N${rowIndex}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ values }),
    }
  );
  
  if (!res.ok) {
    throw new Error('Failed to update friend');
  }
};

export const deleteFriend = async (
    token: string,
    spreadsheetId: string,
    friendId: string,
    allFriends: FriendRecord[]
): Promise<void> => {
    // A proper deletion in Google Sheets requires batchUpdate to delete the row,
    // but clearing the row or simply replacing the whole sheet is easier for a small app.
    // Let's replace the whole sheet contents for simplicity, or just use the batchUpdate to delete row.
    const index = allFriends.findIndex(f => f.id === friendId);
    if (index === -1) throw new Error('Friend not found');
    
    // We need the sheetId (not spreadsheetId) which is usually 0 for the first sheet.
    // To be safe, we can fetch the spreadsheet to get the sheetId.
    const getRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?includeGridData=false`,
        { headers: getHeaders(token) }
    );
    const getData = await getRes.json();
    const sheetId = getData.sheets[0].properties.sheetId;

    const rowIndex = index + 1; // 0-based for the API request (header is 0, first data is 1)
    
    const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
        {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify({
                requests: [
                    {
                        deleteDimension: {
                            range: {
                                sheetId: sheetId,
                                dimension: "ROWS",
                                startIndex: rowIndex,
                                endIndex: rowIndex + 1
                            }
                        }
                    }
                ]
            })
        }
    );

    if (!res.ok) {
        throw new Error('Failed to delete friend');
    }
}
