CREATE OR REPLACE FUNCTION public.increment_subreddit_members(subreddit_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.subreddits 
  SET members = members + 1 
  WHERE id = subreddit_id;
END;
$function$