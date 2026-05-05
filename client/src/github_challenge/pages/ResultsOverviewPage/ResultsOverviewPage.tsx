import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  CoursePhaseParticipationsWithResolution,
  PassStatus,
  getCoursePhaseParticipations,
} from "@tumaet/prompt-shared-state";

import { DeveloperWithInfo } from "../../interfaces/DeveloperWithInfo";
import { getAllDeveloperProfiles } from "../../network/queries/getAllDeveloperProfiles";
import { ChallengeStatus } from "./interfaces/challengeStatus";
import { getChallengeStatusBadge } from "./utils/getChallengeStatusBadge";
import {
  ErrorPage,
  Badge,
  CoursePhaseParticipationsTable,
  ExtraParticipantColumn,
  ManagementPageHeader,
  TableFilter,
} from "@tumaet/prompt-ui-components";
import { format } from "date-fns";

const getChallengeStatus = (
  profile: DeveloperWithInfo | undefined,
): ChallengeStatus => {
  if (!profile) {
    return ChallengeStatus.NOT_STARTED;
  }

  return profile.hasPassed
    ? ChallengeStatus.PASSED
    : ChallengeStatus.NOT_COMPLETED;
};

const challengeStatusFilter: TableFilter = {
  type: "select",
  id: "challengeStatus",
  label: "Challenge Status",
  options: Object.values(ChallengeStatus),
  optionLabel: (value) => getChallengeStatusBadge(value as ChallengeStatus),
  badge: {
    label: "Challenge Status",
    displayValue: (value) => {
      switch (value) {
        case ChallengeStatus.PASSED:
          return "Passed";
        case ChallengeStatus.NOT_COMPLETED:
          return "Not Completed";
        default:
          return "Not Started";
      }
    },
  },
};

export const ResultsOverviewPage = () => {
  const { phaseId } = useParams<{ phaseId: string }>();
  const {
    data: coursePhaseParticipations,
    isPending: isCoursePhaseParticipationsPending,
    isError: isParticipationsError,
    refetch: refetchCoursePhaseParticipations,
  } = useQuery<CoursePhaseParticipationsWithResolution>({
    queryKey: ["participants", phaseId],
    queryFn: () => getCoursePhaseParticipations(phaseId ?? ""),
  });
  const {
    data: developerProfiles,
    isPending: isDeveloperProfilesPending,
    isError: isDeveloperProfileError,
    refetch: refetchDeveloperProfiles,
  } = useQuery<DeveloperWithInfo[]>({
    queryKey: ["developerProfiles", phaseId],
    queryFn: () => getAllDeveloperProfiles(phaseId ?? ""),
  });

  const isError = isParticipationsError || isDeveloperProfileError;
  const isPending =
    isCoursePhaseParticipationsPending || isDeveloperProfilesPending;

  const participations = useMemo(
    () => coursePhaseParticipations?.participations ?? [],
    [coursePhaseParticipations?.participations],
  );

  const handleRefresh = () => {
    refetchCoursePhaseParticipations();
    refetchDeveloperProfiles();
  };

  const developerProfilesByParticipationId = useMemo(
    () =>
      new Map(
        (developerProfiles ?? []).map((profile) => [
          profile.courseParticipationID,
          profile,
        ]),
      ),
    [developerProfiles],
  );

  const extraColumns = useMemo<ExtraParticipantColumn<unknown>[]>(() => {
    const challengeStatusData = participations.map((participation) => ({
      courseParticipationID: participation.courseParticipationID,
      value: getChallengeStatus(
        developerProfilesByParticipationId.get(
          participation.courseParticipationID,
        ),
      ),
    }));

    const passingPositionData = participations.map((participation) => ({
      courseParticipationID: participation.courseParticipationID,
      value:
        developerProfilesByParticipationId.get(
          participation.courseParticipationID,
        )?.passingPosition ?? null,
    }));

    const passedAtData = participations.map((participation) => ({
      courseParticipationID: participation.courseParticipationID,
      value:
        developerProfilesByParticipationId.get(
          participation.courseParticipationID,
        )?.passedAt ?? null,
    }));

    const attemptsData = participations.map((participation) => ({
      courseParticipationID: participation.courseParticipationID,
      value:
        developerProfilesByParticipationId.get(
          participation.courseParticipationID,
        )?.attempts ?? null,
    }));

    return [
      {
        id: "challengeStatus",
        header: "Challenge Status",
        accessorFn: (row) => row.challengeStatus,
        cell: ({ getValue }) =>
          getChallengeStatusBadge(getValue() as ChallengeStatus),
        enableSorting: true,
        sortingFn: (rowA, rowB, columnId) => {
          const order = {
            [ChallengeStatus.NOT_STARTED]: 0,
            [ChallengeStatus.NOT_COMPLETED]: 1,
            [ChallengeStatus.PASSED]: 2,
          };
          return (
            order[rowA.getValue(columnId) as ChallengeStatus] -
            order[rowB.getValue(columnId) as ChallengeStatus]
          );
        },
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!Array.isArray(filterValue) || filterValue.length === 0) {
            return true;
          }

          return filterValue.includes(row.getValue(columnId));
        },
        extraData: challengeStatusData,
      },
      {
        id: "passingPosition",
        header: "Position",
        accessorFn: (row) => row.passingPosition,
        cell: ({ getValue }) => getValue<number | null>() ?? "-",
        enableSorting: true,
        sortingFn: (rowA, rowB, columnId) => {
          const valueA = rowA.getValue<number | null>(columnId) ?? -1;
          const valueB = rowB.getValue<number | null>(columnId) ?? -1;
          return valueA - valueB;
        },
        extraData: passingPositionData,
      },
      {
        id: "passedAt",
        header: "Passed At",
        accessorFn: (row) => row.passedAt,
        cell: ({ getValue }) => {
          const passedAt = getValue<Date | null>();

          return passedAt instanceof Date ? (
            <Badge variant="outline">
              {format(passedAt, "dd.MM.yyyy HH:mm")}
            </Badge>
          ) : (
            "-"
          );
        },
        enableSorting: true,
        sortingFn: (rowA, rowB, columnId) => {
          const valueA = rowA.getValue<Date | null>(columnId);
          const valueB = rowB.getValue<Date | null>(columnId);

          return (valueA?.toISOString() ?? "").localeCompare(
            valueB?.toISOString() ?? "",
          );
        },
        extraData: passedAtData,
      },
      {
        id: "attempts",
        header: "Attempts",
        accessorFn: (row) => row.attempts,
        cell: ({ getValue }) => getValue<number | null>() ?? "-",
        enableSorting: true,
        sortingFn: (rowA, rowB, columnId) => {
          const valueA = rowA.getValue<number | null>(columnId) ?? -1;
          const valueB = rowB.getValue<number | null>(columnId) ?? -1;
          return valueA - valueB;
        },
        extraData: attemptsData,
      },
    ];
  }, [developerProfilesByParticipationId, participations]);

  const studentsPassedChallengeCount = developerProfiles?.filter(
    (profile) => profile.hasPassed,
  ).length;
  const studentsPassedCount = participations.filter(
    (participation) => participation.passStatus === PassStatus.PASSED,
  ).length;

  if (isError) return <ErrorPage onRetry={handleRefresh} />;
  if (isPending)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="relative flex flex-col">
      <div className="space-y-6">
        <ManagementPageHeader>
          Developer Profile Management
        </ManagementPageHeader>
        <div className="text-sm text-muted-foreground">
          {studentsPassedChallengeCount ?? 0} passed challenge |{" "}
          {studentsPassedCount} accepted
        </div>
        <CoursePhaseParticipationsTable
          phaseId={phaseId ?? ""}
          participants={participations}
          extraColumns={extraColumns}
          extraFilters={[challengeStatusFilter]}
        />
      </div>
    </div>
  );
};
