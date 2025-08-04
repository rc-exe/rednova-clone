-- Create increment_comment_count function
CREATE OR REPLACE FUNCTION public.increment_comment_count(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.posts 
  SET comment_count = comment_count + 1 
  WHERE id = post_id;
END;
$function$

-- Create increment_subreddit_members function
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

-- Create decrement_subreddit_members function
CREATE OR REPLACE FUNCTION public.decrement_subreddit_members(subreddit_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.subreddits 
  SET members = members - 1 
  WHERE id = subreddit_id;
END;
$function$