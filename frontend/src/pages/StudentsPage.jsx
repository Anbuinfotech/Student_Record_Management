import { useEffect, useMemo, useState } from "react";
import { FaDownload, FaFilter, FaPlus, FaSearch } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";
import Page from "../components/Page";
import StudentForm from "../components/StudentForm";
import StudentList from "../components/StudentList";
import studentService from "../services/studentService";
const filterKeys = [
  "name",
  "email",
  "phone",
  "course",
  "year",
  "marks",
  "enrollmentDate",
];
export default function StudentsPage() {
  const [students, setStudents] = useState([]),
    [loading, setLoading] = useState(true),
    [query, setQuery] = useState(""),
    [field, setField] = useState("name"),
    [sort, setSort] = useState({ key: "name", direction: "asc" }),
    [page, setPage] = useState(1),
    [modal, setModal] = useState(null),
    [deleting, setDeleting] = useState(null),
    [submitting, setSubmitting] = useState(false);
  const [params] = useSearchParams();
  const pageSize = 7;
  const load = async () => {
    setLoading(true);
    try {
      setStudents((await studentService.getAll()).data);
    } catch {
      toast.error("Could not load student records. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    if (params.get("add")) setModal({});
    if (params.get("focus")) document.getElementById("student-search")?.focus();
  }, [params]);
  const rows = useMemo(
    () =>
      students
        .filter((s) =>
          String(
            field === "all"
              ? filterKeys.map((k) => s[k]).join(" ")
              : (s[field] ?? ""),
          )
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .sort((a, b) => {
          const x = a[sort.key] ?? "",
            y = b[sort.key] ?? "";
          return (
            (typeof x === "number" ? x : String(x).localeCompare(String(y))) *
            (sort.direction === "asc" ? 1 : -1)
          );
        }),
    [students, query, field, sort],
  );
  const shown = rows.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => setPage(1), [query, field]);
  const save = async (data) => {
    setSubmitting(true);
    try {
      if (modal?.id) {
        await studentService.update(modal.id, data);
        toast.success("Student updated successfully.");
      } else {
        await studentService.create(data);
        toast.success("Student added successfully.");
      }
      setModal(null);
      load();
    } catch (err) {
        const errMsg = err.response?.data?.message || (err.response?.data?.errors ? Object.values(err.response.data.errors).join(", ") : err.message) || 'Could not save this student.';
      console.error("Student save error:", err);
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };
  const remove = async () => {
    try {
      await studentService.remove(deleting.id);
      toast.success("Student deleted.");
      setDeleting(null);
      load();
    } catch {
      toast.error("Could not delete student.");
    }
  };
  const exportData = () => {
    const csv = [
      "Name,Email,Phone,Course,Year,Marks,Enrollment Date",
      ...rows.map((s) =>
        [s.name, s.email, s.phone, s.course, s.year, s.marks, s.enrollmentDate]
          .map((v) => `\"${v ?? ""}\"`)
          .join(","),
      ),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "student-records.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("Records exported as CSV.");
  };
  return (
    <Page
      title="Student management"
      subtitle="Create, search, and manage every student record."
      actions={
        <button className="btn btn-primary" onClick={() => setModal({})}>
          <FaPlus /> Add student
        </button>
      }
    >
      <section className="panel student-panel">
        <div className="toolbar">
          <div className="search-input">
            <FaSearch />
            <input
              id="student-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search by ${field === "all" ? "all fields" : field}…`}
            />
          </div>
          <div className="filter-select">
            <FaFilter />
            <select value={field} onChange={(e) => setField(e.target.value)}>
              <option value="all">All fields</option>
              {filterKeys.map((x) => (
                <option key={x} value={x}>
                  {x.replace(/([A-Z])/g, " $1")}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-quiet" onClick={exportData}>
            <FaDownload /> Export
          </button>
        </div>
        <div className="table-caption">
          <span>
            <b>{rows.length}</b> student{rows.length === 1 ? "" : "s"} found
          </span>
          <span>Instant search · Click a table heading to sort</span>
        </div>
        <StudentList
          students={shown}
          loading={loading}
          onEdit={setModal}
          onDelete={setDeleting}
          sort={sort}
          setSort={setSort}
        />
        {rows.length > pageSize && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <span>
              Page {page} of {Math.ceil(rows.length / pageSize)}
            </span>
            <button
              disabled={page >= Math.ceil(rows.length / pageSize)}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>
      {modal && (
        <div className="modal-backdrop">
          <StudentForm
            student={modal.id ? modal : null}
            onClose={() => setModal(null)}
            onSubmit={save}
            submitting={submitting}
          />
        </div>
      )}
      {deleting && (
        <ConfirmModal
          title="Delete student record?"
          message={`This will permanently remove ${deleting.name}'s record. This action cannot be undone.`}
          onClose={() => setDeleting(null)}
          onConfirm={remove}
        />
      )}
    </Page>
  );
}
