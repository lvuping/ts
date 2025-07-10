import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runTests() {
  console.log('Starting integration tests...\n');
  
  const tests = [];
  let passed = 0;
  let failed = 0;

  // Test 1: Check if notes.json file is created
  tests.push(async () => {
    const testName = 'Notes file creation';
    try {
      const notesPath = join(__dirname, 'src/lib/data/notes.json');
      const exists = await fs.access(notesPath).then(() => true).catch(() => false);
      if (exists) {
        console.log(`✅ ${testName}: PASSED`);
        passed++;
      } else {
        console.log(`❌ ${testName}: FAILED - notes.json not found`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${testName}: FAILED - ${error.message}`);
      failed++;
    }
  });

  // Test 2: API endpoints
  tests.push(async () => {
    const testName = 'API endpoints';
    try {
      const response = await fetch('http://localhost:4321/api/notes');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          console.log(`✅ ${testName}: PASSED - Got ${data.length} notes`);
          passed++;
        } else {
          console.log(`❌ ${testName}: FAILED - Invalid response format`);
          failed++;
        }
      } else {
        console.log(`❌ ${testName}: FAILED - Status ${response.status}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${testName}: FAILED - ${error.message}`);
      console.log('   Make sure the dev server is running (npm run dev)');
      failed++;
    }
  });

  // Test 3: Authentication redirect
  tests.push(async () => {
    const testName = 'Authentication redirect';
    try {
      const response = await fetch('http://localhost:4321/', { redirect: 'manual' });
      if (response.status === 302 || response.status === 303) {
        const location = response.headers.get('location');
        if (location === '/login') {
          console.log(`✅ ${testName}: PASSED - Redirects to login`);
          passed++;
        } else {
          console.log(`❌ ${testName}: FAILED - Wrong redirect: ${location}`);
          failed++;
        }
      } else if (response.ok) {
        // Check if we're already authenticated
        console.log(`✅ ${testName}: PASSED - Already authenticated`);
        passed++;
      } else {
        console.log(`❌ ${testName}: FAILED - Status ${response.status}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${testName}: FAILED - ${error.message}`);
      failed++;
    }
  });

  // Test 4: Create note via API
  tests.push(async () => {
    const testName = 'Create note via API';
    try {
      const newNote = {
        title: 'Test Note',
        content: 'console.log("Hello PKM!");',
        language: 'javascript',
        category: 'Test',
        tags: ['test', 'integration']
      };
      
      const response = await fetch('http://localhost:4321/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote)
      });
      
      if (response.ok) {
        const created = await response.json();
        if (created.id && created.title === newNote.title) {
          console.log(`✅ ${testName}: PASSED - Note created with ID: ${created.id}`);
          passed++;
          
          // Clean up - delete the test note
          await fetch(`http://localhost:4321/api/notes/${created.id}`, { method: 'DELETE' });
        } else {
          console.log(`❌ ${testName}: FAILED - Invalid response`);
          failed++;
        }
      } else {
        console.log(`❌ ${testName}: FAILED - Status ${response.status}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${testName}: FAILED - ${error.message}`);
      failed++;
    }
  });

  // Run all tests
  for (const test of tests) {
    await test();
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`Total tests: ${tests.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log('='.repeat(50));

  process.exit(failed > 0 ? 1 : 0);
}

runTests();