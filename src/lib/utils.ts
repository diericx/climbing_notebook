export function confirmDelete(e: MouseEvent) {
  if (!confirm('Are you sure you want to delete this?')) {
    e.preventDefault();
  }
}

